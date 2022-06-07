locals {
  kube_config                        = yamldecode(data.terraform_remote_state.playground-lke.outputs.k8s_config)
  kube_config_token                  = local.kube_config.users.0.user.token
  kube_config_host                   = local.kube_config.clusters.0.cluster.server
  kube_config_cluster_ca_certificate = base64decode(local.kube_config.clusters.0.cluster.certificate-authority-data)
}

data "terraform_remote_state" "playground-lke" {
  backend = "remote"
  config = {
    organization = "hoprnet"
    workspaces = {
      name = "playground-lke"
    }
  }
}

provider "helm" {
  kubernetes {
    host                   = local.kube_config_host
    token                  = local.kube_config_token
    cluster_ca_certificate = local.kube_config_cluster_ca_certificate
  }
}

provider "kubectl" {
  host                   = local.kube_config_host
  token                  = local.kube_config_token
  cluster_ca_certificate = local.kube_config_cluster_ca_certificate
  load_config_file       = false
}
