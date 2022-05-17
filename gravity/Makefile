.POSIX:

all: help

.PHONY: deps
deps: ## install dependencies
	cargo install cargo-watch
	cargo install cargo-expand

.PHONY: watch-build-run
watch-build-run: ## rebuilds and runs server on each change
	cargo watch -x fmt -x b -x r

.PHONY: fmt
fmt: ## format source files
	cargo fmt
	cat Cargo.toml | yj -tt > Cargo.toml.new
	mv Cargo.toml.new Cargo.toml

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
