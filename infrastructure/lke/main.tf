module "lke" {
  source  = "app.terraform.io/hoprnet/lke/linode"
  version = "0.1.1"

  cluster_name  = "playground"
  machine_type  = "g6-standard-8"
  min_num_nodes = 1
  max_num_nodes = 10
  region        = "eu-central"
}
