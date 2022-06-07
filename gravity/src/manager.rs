use crate::cluster::Cluster;
use crate::GLOBAL;
use actix::prelude::*;
use slog::info;
use std::collections::hash_map::DefaultHasher;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;

pub struct Manager {
    pub cluster_count: i32,
    pub simulate: bool,

    pub new: HashMap<String, Addr<Cluster>>,
    pub starting: HashMap<String, Addr<Cluster>>,
    pub ready: HashMap<String, Addr<Cluster>>,
    pub busy: HashMap<String, Addr<Cluster>>,
}

impl Default for Manager {
    fn default() -> Manager {
        Manager {
            cluster_count: 0,
            simulate: false,
            new: HashMap::new(),
            starting: HashMap::new(),
            ready: HashMap::new(),
            busy: HashMap::new(),
        }
    }
}

impl Actor for Manager {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Context<Self>) {
        info!(
            &GLOBAL.logger,
            "Started manager with cluster size {}", self.cluster_count
        );
        for i in 1..self.cluster_count {
            let id = create_id(i);
            self.create_cluster(ctx, id);
        }
    }

    fn stopped(&mut self, _ctx: &mut Context<Self>) {
        info!(&GLOBAL.logger, "Stopped manager");
    }
}

impl Manager {
    fn create_cluster(&mut self, ctx: &Context<Self>, id: String) {
        let addr = ctx.address();
        info!(&GLOBAL.logger, "Create cluster {}", id);
        let cluster = Cluster::create(|ctx: &mut actix::Context<Cluster>| Cluster {
            id: Some(id),
            manager: Some(addr),
            ..Default::default()
        });
        let cluster_id_res = cluster.send(GetId).await;
        if cluster_id.is_ok() {
            let cluster_id = cluster_id_res.unwrap();
            info!(
                &GLOBAL.logger,
                "Created cluster {} at address {}",
                cluster_id,
                format!("{cluster:?}")
            );
            self.new.insert(cluster_id, cluster);
        } else {
            error!(
                &GLOBAL.logger,
                "Failed to create cluster {}: {}, retrying",
                id,
                cluster_id_res.unwrap_err()
            );
            self.create_cluster(ctx, id);
        }
    }
}

fn create_id(i: i32) -> String {
    let mut s = DefaultHasher::new();
    i.hash(&mut s);
    let hash = s.finish();
    format!("{:x}", hash)
}
