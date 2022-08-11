# Playground

A testing area for featured HOPR dApps.

# Contents of this repository

The repository contains both application code and infrastructure configuration.

```
.
├── ansible            contains Ansible configuration for a playground server
├── gravity            (WIP) k8s-native cluster manager
├── infrastructure     (WIP) k8s setup
├── satellite          server-local cluster manager exposing an API
└── website            user-facing website which uses satellite underneath
```

For details on each project refer to their respective documentation.

# Architecture

Playground follows a simple approach whereby the user-facing website only knows
about a single backend server which it queries for data about available clusters
and to activate a cluster.

**NOTE:** This approach can be adapted to support multiple backend servers in the
future by extending the website itself.

The backend API is provided by `satellite`, the server-local cluster-manager. A
cluster is a Docker container running the `hopr-pluto` Docker image, a isolated
HOPR cluster with 5 fully connected HOPRd nodes. Clusters are pre-warmed,
started before they are used. Only when a user activates a cluster the cluster
endpoints are exposed to the outside world. After a pre-set amount of time an
activated cluster is deleted and a new fresh cluster will be created in its
place.

The exposure of cluster endpoints is done through runtime configuration of a
server-local `haproxy` instance.

![Architecture](/architecture.svg)

## Exposed Endpoints

Any of these endpoints is deployment specific. These are example based on the
main playground deployment.

**Website:** https://playground.hoprnet.org

**Satellite API:** https://playground-alpha.hoprtech.net

**Example Cluster Node 0 API:** https://zero_mimas_rhine_navy.playground.hoprnet.org:3001

**Example Cluster Node 1 API:** https://one_mimas_rhine_navy.playground.hoprnet.org:3001

**Example Cluster Node 2 API:** https://two_mimas_rhine_navy.playground.hoprnet.org:3001

**Example Cluster Node 3 API:** https://three_mimas_rhine_navy.playground.hoprnet.org:3001

**Example Cluster Node 4 API:** https://four_mimas_rhine_navy.playground.hoprnet.org:3001

# Development Setup

You may run a complete manual integration test setup locally which can be useful
during development.

0. Go into satellite folder: `cd satellite`
1. Start website: `make start-website`
2. Start reverse proxy: `make start-haproxy`
3. Start satellite API server: `make start-satellite`

**NOTE:** For testing purposes you may want to increase the `max_lifetime` of a
cluster though to e.g. 10 minutes: `make start-satellite max_lifetime=600`

The website will be accessible at `http://localhost:8996`.

The satellite API server will be accessible at `http://localhost:8997`.
