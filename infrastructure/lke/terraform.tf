terraform {
  cloud {
    organization = "hoprnet"

    workspaces {
      name = "playground-lke"
    }
  }
}
