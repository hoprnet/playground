.POSIX:

haproxy_conf := haproxy-satellite.conf

all: help

.PHONY: fmt
fmt: ## format source files
	black *.py

.PHONY: start-satellite
start-satellite: image=gcr.io/hoprassociation/hopr-pluto:master-goerli
start-satellite: max_lifetime=60
start-satellite: port=8998
start-satellite: size=3
start-satellite: ## start local server instance
	./satellite.py --port $(port) --sync-wait-time 1 \
		--post-haproxy-config-cmd "lsof -i :8997 -t | xargs kill -USR2" \
		$(image) $(size) $(max_lifetime) 19000 "$(haproxy_conf)"

.PHONY: start-haproxy
start-haproxy: ## start local haproxy instance
	# ensure custom configration file is available when haproxy starts up
	echo "backend satellite_cluster" > "$(haproxy_conf)"
	haproxy -f haproxy.conf -f "$(haproxy_conf)"

.PHONY: start-website
start-website: ## start local website instance
	cd ../website; yarn; NEXT_PUBLIC_API_ENDPOINT="http://localhost:8997" yarn dev

.PHONY: test
test: ## run integration test
	./test.sh

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
