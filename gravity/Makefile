.POSIX:

all: help

.PHONY: deps
deps: ## install dependencies
	cargo install cargo-expand

.PHONY: watch-build-run
watch-build-run: ## rebuilds and runs server on each change
	ls src/*.rs Cargo.* | \
		entr -r -s 'cargo fmt && cargo b && cargo r -- --cluster-count 10'

.PHONY: build
build: ## builds the binary
build: fmt
	cargo b

.PHONY: fmt
fmt: ## format source files
	cargo fmt
	cat Cargo.toml | yj -tt > Cargo.toml.new
	mv Cargo.toml.new Cargo.toml

build-docker-minikube: ## builds the Docker image using the Docker daemon used by Minikube
	@echo "=== Ensure minikube is running"
	minikube start
	@echo "=== Build Docker image"
	eval $(minikube docker-env); \
		docker build -t playground:local-dev .

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
