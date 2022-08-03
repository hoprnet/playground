.POSIX:

all: help

.PHONY: fmt
fmt: ## format source files
	black *.py

.PHONY: start-local
start-local: image=gcr.io/hoprassociation/hopr-pluto:master-goerli
start-local: max_lifetime=60
start-local: port=19000
start-local: size=3
start-local: ## start local server instance
	./satellite.py --port $(port) --sync-wait-time 1 \
		$(image) $(size) $(max_lifetime) 19000

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
