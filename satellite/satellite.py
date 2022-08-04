#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread, current_thread, Lock
from datetime import timedelta

import os
import json
import time
import signal
import threading
import argparse
import subprocess
import random

parser = argparse.ArgumentParser(
    description="starts a server which manages Pluto docker containers on the local host and exposes some management functions via an HTTP API",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
)
parser.add_argument(
    "pluto_image",
    type=str,
    help="the Docker image for pluto which should be used",
)
parser.add_argument(
    "pluto_container_count",
    type=int,
    help="the number of containers which should be run at any point in time",
)
parser.add_argument(
    "pluto_container_max_lifetime",
    type=int,
    help="the max lifetime (in seconds) of a container after it was activated",
)
parser.add_argument(
    "pluto_container_base_port",
    type=int,
    help="the base port used for published container ports",
)
parser.add_argument(
    "haproxy_conf",
    type=str,
    help="destination filename for the generated haproxy sub-configuration",
)
parser.add_argument(
    "--target-domain",
    type=str,
    default="localhost",
    help="domain used when constructing the reverse proxy configuration for all clusters",
)
parser.add_argument(
    "--target-protocol",
    type=str,
    default="http",
    help="protocol used for constructing the reverse proxy cluster urls",
)
parser.add_argument(
    "--host",
    type=str,
    default="127.0.0.1",
    help="host the server should listen on",
)
parser.add_argument(
    "--port",
    type=int,
    default=8998,
    help="port the server should listen on",
)
parser.add_argument(
    "--sync-wait-time",
    type=int,
    default=10,
    help="time (in seconds) between container sync operations",
)

args = parser.parse_args()

# the following lists of data are used for container name generation
COLORS = [
    "black",
    "white",
    "yellow",
    "red",
    "green",
    "silver",
    "gray",
    "maroon",
    "purple",
    "fuchsia",
    "lime",
    "olive",
    "navy",
    "blue",
    "teal",
    "acqua",
]

MOONS = [
    "moon",
    "europa",
    "ganymede",
    "titan",
    "io",
    "callisto",
    "amalthea",
    "elara",
    "mimas",
    "himalia",
    "carpo",
    "ananke",
    "deimos",
    "phobos",
    "dione",
]

RIVERS = [
    "nile",
    "mekong",
    "rhine",
    "amazon",
    "danube",
    "indus",
    "ganges",
    "elbe",
    "volga",
    "chenab",
    "kama",
    "aras",
    "fraser",
    "missouri",
    "godavari",
]


def generate_container_name():
    data = [COLORS, MOONS, RIVERS]
    random.shuffle(data)
    choices = [random.sample(d, 1).pop() for d in data]
    name = "_".join(choices)
    return name


def generate_container_names(count):
    names = []
    while len(names) < count:
        name = generate_container_name()
        if name not in names:
            names.append(name)
    return names


def generate_container_base_ports(count):
    return [args.pluto_container_base_port + (p * 10) for p in range(0, count)]


class Container:
    def __init__(self, name, base_port, started_at=None):
        self.name = name
        self.started_at = started_at
        self.state = "created"
        # the container requires 10 ports (2 per hoprd node)
        self.base_port = base_port
        self.api_ports = [base_port + i for i in range(5)]
        self.admin_ports = [base_port + i for i in range(5, 10)]
        # host port to container port
        self.port_mappings = [
            # API ports
            "-p",
            "{}-{}:13301-13305".format(base_port + 0, base_port + 4),
            # Admin UI ports
            "-p",
            "{}-{}:19091-19095".format(base_port + 5, base_port + 9),
        ]
        nodes = []
        for i in range(5):
            admin_port = self.admin_ports[i]
            api_port = self.api_ports[i]
            api_url = (
                f"{args.target_protocol}://{self.name}.{args.target_domain}:{api_port}"
            )
            admin_url = f"{args.target_protocol}://{self.name}.{args.target_domain}:{admin_port}"
            nodes.append({"api_url": api_url, "admin_url": admin_url})
        self.nodes = nodes

    def activate(self):
        self.started_at = int(round(time.time()))
        self.finished_at = self.started_at + args.pluto_container_max_lifetime
        self.state = "activated"

    def create(self):
        print("creating container {}".format(self.name))
        cmd = [
            "docker",
            "run",
            "-d",
            "-it",
            "--rm",
            "--name",
            self.name,
            *self.port_mappings,
            args.pluto_image,
        ]
        result = subprocess.run(cmd)
        if result.returncode > 0:
            print(
                "creation of container {} failed with exit code {}".format(
                    self.name, result.returncode
                )
            )
            return False
        print("creation of container {} succeeded".format(self.name))
        return True

    def delete(self):
        print("deleting container {}".format(self.name))
        cmd = ["docker", "rm", "-f", self.name]
        result = subprocess.run(cmd)
        if result.returncode > 0:
            print(
                "deletion of container {} failed with exit code {}".format(
                    self.name, result.returncode
                )
            )


class State:
    def __init__(self, containers=[]):
        self.containers = containers
        # generate 10x the amount of names we need
        self.available_container_names = generate_container_names(
            args.pluto_container_count * 3
        )
        # generate 10x the amount of base ports we need
        self.available_base_ports = generate_container_base_ports(
            args.pluto_container_count * 3
        )

    def get_name(self):
        name = self.available_container_names.pop()
        return name

    def get_base_port(self):
        port = self.available_base_ports.pop()
        return port

    def sync_containers(self):
        print("sync containers")
        # delete old containers
        for c in self.old_containers():
            self.delete_container(c)
        # start new containers
        for i in range(len(self.containers), args.pluto_container_count):
            name = self.get_name()
            base_port = self.get_base_port()
            c = Container(name, base_port)
            if c.create():
                self.containers.append(c)
        # update haproxy configuration
        self.write_haproxy_configuration()
        print("sync containers finished")

    def write_haproxy_configuration(self):
        conf_frontends = []
        conf_backends = []
        bind_ports = []

        for c in self.active_containers():
            # need to use underscores in haproxy var names
            name_acl = c.name.replace("-", "_")
            backends = ""
            frontends = f"""
    acl url_{name_acl} hdr(host) -i {c.name}.{args.target_domain}
            """

            for port in c.admin_ports:
                frontends += f"""
    acl port_{name_acl}_admin_{port} hdr(port) -i {port}
    use_backend satellite_cluster_{name_acl}_admin if url_{name_acl} port_{name_acl}_admin_{port}
                """

                backends += f"""
backend satellite_cluster_{name_acl}_admin_{port}
    server server1 127.0.0.1:{port}
                """

            for port in c.api_ports:
                frontends += f"""
    acl port_{name_acl}_api_{port} hdr(port) -i {port}
    use_backend satellite_cluster_{name_acl}_api if url_{name_acl} port_{name_acl}_api_{port}
                """

                backends += f"""
backend satellite_cluster_{name_acl}_api_{port}
    server server1 127.0.0.1:{port}
                """

            conf_frontends.append(frontends)
            conf_backends.append(backends)

            bind_ports += [f":::{p}" for p in [*c.admin_ports, *c.api_ports]]

        conf = f"""
frontend satellite_clusters
        """

        if args.target_protocol == "https":
            conf += f"""
    bind {",".join(bind_ports)} v4v6 alpn h2,http/1.1 ssl crt /etc/haproxy/certs/{args.target_domain}/fullchain_haproxy.pem
            """
        else:
            conf += f"""
    bind {",".join(bind_ports)} v4v6 h2,http/1.1
            """

        conf += f"""
    redirect scheme https unless {{ ssl_fc }}
    {os.linesep.join(conf_frontends)}

{f"{os.linesep}{os.linesep}".join(conf_backends)}
        """

        with open(args.haproxy_conf, "w", encoding="utf-8") as f:
            f.write(conf)

    def old_containers(self):
        now = int(round(time.time()))
        containers = [
            c for c in self.containers if c.state == "activated" and c.finished_at < now
        ]
        return containers

    def free_containers(self):
        now = int(round(time.time()))
        containers = [c for c in self.containers if c.state == "created"]
        return containers

    def active_containers(self):
        now = int(round(time.time()))
        containers = [
            c for c in self.containers if c.state == "activated" and c.finished_at > now
        ]
        return containers

    def activate_container(self):
        containers = self.free_containers()
        if len(containers) == 0:
            return None

        container = containers.pop()
        container.activate()
        self.containers = [c for c in self.containers if c.name != container.name]
        self.containers.append(container)
        return container

    def delete_container(self, container):
        # delete in Docker
        container.delete()
        # remove from state
        self.containers = [c for c in self.containers if c.name == container.name]
        # enable name for re-use
        self.available_container_names.insert(0, container.name)
        # enable base port for re-use
        self.available_base_ports.insert(0, container.base_port)

    def cleanup(self):
        for c in self.containers:
            c.delete()


state = State()


class RequestHandler(BaseHTTPRequestHandler):
    # This handler implements the following routing:
    #
    # GET /api/clusters - lists all relevant cluster info
    # POST /api/clusters/activate - activates a cluster and responds with the
    # relevant connection information

    def set_response_headers(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

    def do_HEAD(self):
        self.handle_request()

    def do_GET(self):
        self.handle_request()

    def do_POST(self):
        self.handle_request()

    def handle_request(self):
        match (self.command, self.path):
            case (("HEAD" | "GET") as command, "/api/clusters"):
                self.set_response_headers()
                self.handle_get_clusters_info()
            case (("HEAD" | "POST") as command, "/api/clusters/activate"):
                self.set_response_headers()
                self.handle_activate_cluster()
            case _:
                self.send_response(404)
                self.send_header("Content-type", "application/json")
                self.end_headers()

    def handle_get_clusters_info(self):
        free_count = len(state.free_containers())
        msg = {
            "total_clusters_count": len(state.containers),
            "free_clusters_count": free_count,
        }
        self.wfile.write(json.dumps(msg).encode())

    def handle_activate_cluster(self):
        msg = {}
        container = state.activate_container()
        if container:
            msg = {
                "cluster_name": container.name,
                "cluster_valid_until": container.finished_at,
                "cluster_nodes": container.nodes,
            }
        else:
            msg = {"error": "no cluster available"}
        self.wfile.write(json.dumps(msg).encode())


mutex = Lock()


def periodic_sync_containers():
    if mutex.acquire(1):
        state.sync_containers()
        mutex.release()


class ProgramKilled(Exception):
    pass


def signal_handler(signum, frame):
    raise ProgramKilled


class Job(threading.Thread):
    def __init__(self, interval, execute, *args, **kwargs):
        threading.Thread.__init__(self)
        self.daemon = False
        self.stopped = threading.Event()
        self.interval = interval
        self.execute = execute
        self.args = args
        self.kwargs = kwargs

    def stop(self):
        self.stopped.set()
        self.join()

    def run(self):
        while not self.stopped.wait(self.interval.total_seconds()):
            self.execute(*self.args, **self.kwargs)


def serve_forever(httpd):
    with httpd:
        print("server listening on {}:{}".format(args.host, args.port))
        httpd.serve_forever()
        print("server stopping")


def run():
    server_address = (args.host, args.port)
    httpd = ThreadingHTTPServer(server_address, RequestHandler)
    httpd.allow_reuse_address = True

    httpd_thread = Thread(target=serve_forever, args=(httpd,), daemon=True)
    httpd_thread.start()

    print("Using container names: {}".format(state.available_container_names))
    print("Using container base ports: {}".format(state.available_base_ports))

    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    job = Job(
        interval=timedelta(seconds=args.sync_wait_time),
        execute=periodic_sync_containers,
    )
    job.start()

    while True:
        try:
            time.sleep(1)
        except ProgramKilled:
            print("shutting down")
            httpd.shutdown()
            httpd_thread.join()
            print("server shut down")
            job.stop()
            print("sync process shut down")
            state.cleanup()
            print("state cleaned up")
            break


if __name__ == "__main__":
    run()
