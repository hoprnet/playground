.POSIX:

all: help

.PHONY: local
local: ## apply terraform configuration to local minikube cluster
	minikube start
	cp providers.tf.local providers.tf
	cp terraform.tf.local terraform.tf
	terraform init
	terraform plan || { make reset && exit 1; }
	terraform apply || { make reset && exit 1; }
	make reset

.PHONY: reset
reset: ## reset local changes
	git checkout -- providers.tf terraform.tf

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
