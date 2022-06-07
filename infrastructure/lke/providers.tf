terraform {
  required_version = ">= 1.1.8"
}

provider "linode" {
  api_version = "v4beta"
  token       = var.linode_api_token
}
