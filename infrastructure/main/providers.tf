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
