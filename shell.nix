{ pkgs ? import <nixpkgs> {}, ... }:
let
  linuxPkgs = with pkgs; lib.optional stdenv.isLinux (
    [
    inotifyTools
    mkpasswd
  ]
  );
  macosPkgs = with pkgs; lib.optional stdenv.isDarwin (
    with darwin.apple_sdk.frameworks; [
      # macOS file watcher support
      CoreFoundation
      CoreServices
    ]
  );
in
with pkgs;
mkShell {
  buildInputs = [
    ## base
    envsubst

    nodejs-16_x # v16.5.0
    (yarn.override { nodejs = nodejs-16_x; }) # v1.22.10

    kubectl
    minikube

    rust-bin.stable.latest.default
    yj
    entr

    # infrastructure
    terraform
    kubernetes-helm
    # using python 3.9 because its also the default on Debian 11
    python39
    python39Packages.black
    python39Packages.ruamel_yaml
    python39Packages.simplejson
    python39Packages.jmespath
    ansible_2_13
    ansible-lint
    haproxy

    # custom pkg groups
    macosPkgs
    linuxPkgs
  ];
}
