.POSIX:

all: help

.PHONY: fmt
fmt: ## format yaml files
	ansible-lint

.PHONY: init
init: ## set up local environment
	cd ../ && ${MAKE} init

.PHONY: ping
ping: ## test connection to all servers
	ansible all -i inventories/all/hosts.yml -m ping

.PHONY: get-info
get-info: ## get inventory information for all servers
	ansible all -i inventories/all/hosts.yml -m setup

.PHONY: configure-servers
configure-servers: ## configure servers
	ansible-playbook main.yml -i inventories/all/hosts.yml -b -K

.PHONY: bootstrap-servers
bootstrap-servers: ## configure servers for the first time using user root
ifeq ($(servers),)
	@echo "parameter <servers> missing"
	@exit 1
endif
	@echo "This attempt may fail eventually but configures enough for the server to be initialized."
	@echo "Waiting 10 seconds..."
	sleep 10
	ansible-playbook main.yml -i inventories/all/hosts.yml -l $(servers) -u root \
		-e ansible_ssh_user=root -e ansible_ssh_port=22

.PHONY: reset-ansible-tmp
reset-ansible-tmp: ## remove ansible tmp folder on servers
	ansible all -i inventories/all/hosts.yml -m raw -a "rm -rf /tmp/.ansible" -b -K

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
