output "k8s_cluster_dashboard" {
  value = module.lke.cluster_dashboard_url
}

output "k8s_config" {
  value     = module.lke.kube_config
  sensitive = true
}
