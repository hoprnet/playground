# hoprverse
Playground for featured HOPR dApps

# Development Setup

You may run a setup similar to the production setup locally.

0. Go into satellite folder: `cd satellite`
1. Start website: `make start-website`
2. Start reverse proxy: `make start-haproxy`
3. Start satellite API server: `make start-satellite`

Now the website will be accessible at `http://localhost:8996`.
The API server will be accessible at `http://localhost:8997`.

# Production Setup

Website running on Vercel served at `https://playground.hoprnet.org`.

Satellite (Backend API) running on dedicated server served at `https://playground-alpha.hoprtech.net`.

Satellite Clusters (individual HOPR nodes) running on dedicated server served at
`https://CLUSTER_NAME.playground.hoprnet.org:CUSTOM_PORT`.

An example set of node URLs:

```
https://CLUSTER_NAME.playground.hoprnet.org:13001
https://CLUSTER_NAME.playground.hoprnet.org:13002
https://CLUSTER_NAME.playground.hoprnet.org:13003
https://CLUSTER_NAME.playground.hoprnet.org:13004
https://CLUSTER_NAME.playground.hoprnet.org:13005
https://CLUSTER_NAME.playground.hoprnet.org:13006
```
