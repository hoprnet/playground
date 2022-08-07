#!/usr/bin/env bash

# prevent sourcing of this script, only allow execution
$(return >/dev/null 2>&1)
test "$?" -eq "0" && { echo "This script should only be executed." >&2; exit 1; }

# exit on errors, undefined variables, ensure errors in pipes are not hidden
set -Eeuo pipefail

# set log id and use shared log function for readable logs
declare mydir
mydir="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)"

# helper functions
log() {
  local time
  # second-precision is enough
  time=$(date -u +%y-%m-%dT%H:%M:%SZ)
  echo >&2 -e "${time} [test] ${1-}"
}

msg() {
  echo >&2 -e "${1-}"
}

# work

declare dev_port="8998"
declare haproxy_port="8997"
declare clusters_max_count="3"

function cleanup {
  local EXIT_CODE=$?

  # at this point we don't want to fail hard anymore
  trap - SIGINT SIGTERM ERR EXIT
  set +Eeuo pipefail

  log "shut down satellite if still running"
  lsof -i ":${dev_port}" -s TCP:LISTEN -t | xargs -I {} -n 1 kill {}
  log "shut down haproxy if still running"
  lsof -i ":${haproxy_port}" -s TCP:LISTEN -t | xargs -I {} -n 1 kill {}

  exit $EXIT_CODE
}

trap cleanup SIGINT SIGTERM ERR EXIT

function curl_call() {
  declare path="${1}"
  declare method="${2}"

  curl -X "${method}" -s \
    -H "Host: localhost" \
    -H "Content-Type: application/json" \
    "http://127.0.0.1:${haproxy_port}${path}"
}

log "check if haproxy is running on port ${haproxy_port}"
if ! nc -z -w 1 127.0.0.1 ${haproxy_port}; then
  log "start haproxy"
  make start-haproxy &
fi

log "check if satellite is running on port ${dev_port}"
if ! nc -z -w 1 127.0.0.1 ${dev_port}; then
  log "start satellite on port ${dev_port}"
  make start-local port=${dev_port} max_lifetime=10 size=${clusters_max_count} &
  sleep 10
fi

declare total_clusters_count=-1
declare free_clusters_count=-1
declare activate_counter=0

log "activate clusters one by one"

while [ "${free_clusters_count}" != 0 ]; do
  total_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.total_clusters_count')"
  free_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.free_clusters_count')"

  [ "${total_clusters_count}" = "$((free_clusters_count+activate_counter))" ]
  [ "${total_clusters_count}" = "${clusters_max_count}" ]

  (( activate_counter=activate_counter+1 ))

  declare cluster_name activate_result
  activate_result="$(curl_call "/api/clusters/activate" "POST")"
  [ -n "$(echo "${activate_result}" | jq '.cluster_name')" ]
  [ "$(echo "${activate_result}" | jq '.cluster_nodes | length')" = "5" ]

  total_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.total_clusters_count')"
  free_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.free_clusters_count')"

  [ "${total_clusters_count}" = "$((free_clusters_count+activate_counter))" ]
  [ "${total_clusters_count}" = "${clusters_max_count}" ]
done

log "waiting for all activated clusters to be deleted"

while [ "${free_clusters_count}" != "${total_clusters_count}" ] || [ "${total_clusters_count}" != "${clusters_max_count}" ]; do
  sleep 1
  total_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.total_clusters_count')"
  free_clusters_count="$(curl_call "/api/clusters" "GET" | jq '.free_clusters_count')"
done
