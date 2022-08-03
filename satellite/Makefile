.POSIX:

haproxy_conf := haproxy-satellite.conf

all: help

.PHONY: fmt
fmt: ## format source files
	black *.py

.PHONY: start-local
start-local: image=gcr.io/hoprassociation/hopr-pluto:master-goerli
start-local: max_lifetime=60
start-local: port=8998
start-local: size=3
start-local: ## start local server instance
	./satellite.py --port $(port) --sync-wait-time 1 \
		$(image) $(size) $(max_lifetime) 19000 "$(haproxy_conf)"

.PHONY: start-haproxy
start-haproxy:
	# ensure custom configration file is available when haproxy starts up
	[ -f "$(haproxy_conf)" ] || { touch "$(haproxy_conf)"; }
	haproxy -f haproxy.conf -f "$(haproxy_conf)"

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
