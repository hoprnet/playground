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
import string

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
parser.add_argument(
    "--post-haproxy-config-cmd",
    type=str,
    help="command which should be executed after the haproxy configuration was written",
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

ALL_NAME_PARTS = [*RIVERS, *COLORS, *MOONS]


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


def docker_remove_container(name):
    print("deleting container {}".format(name))
    cmd = ["docker", "rm", "-f", name]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode > 0:
        print(
            "deletion of container {} failed with exit code {}: {}".format(
                name, result.returncode, result.stderr
            )
        )


def num_to_word(i):
    if i == 0:
        return "zero"
    elif i == 1:
        return "one"
    elif i == 2:
        return "two"
    elif i == 3:
        return "three"
    elif i == 4:
        return "four"
    elif i == 5:
        return "five"
    elif i == 6:
        return "six"
    elif i == 7:
        return "seven"
    elif i == 8:
        return "eight"
    elif i == 9:
        return "nine"


def generate_api_token():
    letters = string.hexdigits + "#"
    size = 24
    token = "".join(random.choice(letters) for i in range(size))
    # ensure one special sign is present
    if "#" in token:
        return token
    return token + "#"


PUBLIC_ADMIN_PORT = 3000
PUBLIC_API_PORT = 3001


class Container:
    def __init__(self, name, base_port, started_at=None):
        self.name = name
        self.started_at = started_at
        self.state = "created"
        self.api_token = generate_api_token()
        # the container requires 10 ports (2 per hoprd node)
        self.base_port = base_port
        self.api_ports = [base_port + i for i in range(5)]
        self.admin_ports = [base_port + i for i in range(5, 10)]
        docker_api_port = [13301 + i for i in range(5)]
        docker_admin_port = [19501 + i for i in range(5)]
        # host port to container port
        self.port_mappings = []
        for i in range(5):
            self.port_mappings += [
                "-p",
                f"127.0.0.1:{self.api_ports[i]}:{docker_api_port[i]}",
            ]
            self.port_mappings += [
                "-p",
                f"127.0.0.1:{self.admin_ports[i]}:{docker_admin_port[i]}",
            ]
        nodes = []
        for i in range(5):
            admin_port = self.admin_ports[i]
            api_port = self.api_ports[i]
            domain = f"{num_to_word(i)}_{self.name}.{args.target_domain}"
            api_url = f"{args.target_protocol}://{domain}:{PUBLIC_API_PORT}"
            admin_url = f"{args.target_protocol}://{domain}:{PUBLIC_ADMIN_PORT}"
            nodes.append(
                {
                    "api_token": self.api_token,
                    "api_url": api_url,
                    "admin_url": admin_url,
                    "domain": domain,
                    "api_port": api_port,
                    "admin_port": admin_port,
                }
            )
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
            "--pull",
            "always",
            "-e",
            "HOPRD_API_TOKEN",
            "-d",
            "-it",
            "--rm",
            "--name",
            self.name,
            *self.port_mappings,
            args.pluto_image,
        ]
        custom_env = os.environ.copy()
        custom_env["HOPRD_API_TOKEN"] = self.api_token
        result = subprocess.run(cmd, capture_output=True, env=custom_env)
        if result.returncode > 0:
            print(
                "creation of container {} failed with exit code {}: {}".format(
                    self.name, result.returncode, result.stderr
                )
            )
            return False
        print("creation of container {} succeeded".format(self.name))
        return True

    def delete(self):
        docker_remove_container(self.name)


class State:
    def __init__(self, containers=[]):
        self.last_haproxy_conf = ""
        self.containers = containers
        # generate 10x the amount of names we need
        self.available_container_names = generate_container_names(
            args.pluto_container_count * 3
        )
        # generate 10x the amount of base ports we need
        self.available_base_ports = generate_container_base_ports(
            args.pluto_container_count * 3
        )

    # remove containers which are not managed by this state
    def purge_zombie_containers(self):
        result = subprocess.run(
            ["docker", "ps", "--format", "{{.Names}}"], capture_output=True
        )
        if result.returncode > 0:
            print(
                "execution of docker container list failed with exit code {}: {}".format(
                    result.returncode, result.stderr
                )
            )
            return
        names = result.stdout.split()
        for n in names:
            name = str(n, "UTF-8")
            containers = [c for c in self.containers if c.name == name]
            if len(containers) == 1:
                # we know the container, can skip
                continue
            name_parts = name.split("_")
            if all([(p in ALL_NAME_PARTS) for p in name_parts]):
                # the name could have been used by a previous server, so purge
                print(f"purging zombie container {name}")
                docker_remove_container(name)

    def get_name(self):
        name = self.available_container_names.pop()
        return name

    def get_base_port(self):
        port = self.available_base_ports.pop()
        return port

    def sync_containers(self):
        print("sync containers")
        self.purge_zombie_containers()
        # delete old containers
        for c in self.old_containers():
            print(f"deleting old container {c.name}")
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
        conf_backends = []

        backend_admin = f"""
backend satellite_clusters_admin
        """
        backend_api = f"""
backend satellite_clusters_api
        """

        for c in self.active_containers():
            for n in c.nodes:
                domain = n["domain"]

                backend_admin += f"""
    acl url_{domain} hdr(host) -i -m beg {domain}
    use-server satellite_clusters_admin_{domain} if url_{domain}
    server satellite_clusters_admin_{domain} 127.0.0.1:{n["admin_port"]} weight 0
                """

                backend_api += f"""
    acl url_{domain} hdr(host) -i -m beg {domain}
    use-server satellite_clusters_api_{domain} if url_{domain}
    server satellite_clusters_api_{domain} 127.0.0.1:{n["api_port"]} weight 0
                """

        backend_admin += f"""
    server nginx_fallback 127.0.0.1:8080 check
        """

        backend_api += f"""
    server nginx_fallback 127.0.0.1:8080 check
        """

        conf_backends += [backend_admin, backend_api]

        conf = f"""
{os.linesep.join(conf_backends)}
"""

        with open(args.haproxy_conf, "w", encoding="utf-8") as f:
            f.write(conf)
            f.write("")

        if args.post_haproxy_config_cmd and self.last_haproxy_conf != conf:
            result = subprocess.run(
                args.post_haproxy_config_cmd, shell=True, capture_output=True
            )
            if result.returncode > 0:
                print(
                    "execution of post_haproxy_config_cmd failed with exit code {}: {}".format(
                        result.returncode, result.stderr
                    )
                )

        self.last_haproxy_conf = conf

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
        self.containers = [c for c in self.containers if c.name != container.name]
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
        c = self.command
        p = self.path
        if c in ["HEAD", "GET"] and p == "/api/clusters":
            self.set_response_headers()
            self.handle_get_clusters_info()
        elif c in ["HEAD", "POST"] and p == "/api/clusters/activate":
            self.set_response_headers()
            self.handle_activate_cluster()
        else:
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
            nodes = [
                {
                    "api_url": n["api_url"],
                    "admin_url": n["admin_url"],
                    "api_token": n["api_token"],
                }
                for n in container.nodes
            ]
            msg = {
                "cluster_name": container.name,
                "cluster_valid_until": container.finished_at,
                "cluster_nodes": nodes,
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

    last_sync = 0
    while True:
        try:
            now = int(round(time.time()))
            if now > (last_sync + args.sync_wait_time):
                periodic_sync_containers()
                last_sync = int(round(time.time()))
            time.sleep(1)
        except ProgramKilled:
            print("shutting down")
            httpd.shutdown()
            httpd_thread.join()
            print("server shut down")
            state.cleanup()
            print("state cleaned up")
            break


if __name__ == "__main__":
    run()
