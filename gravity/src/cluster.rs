use crate::manager::Manager;
use crate::GLOBAL;
use actix::prelude::*;
use slog::info;

pub enum ClusterStatus {
    New,
    Starting,
    Ready,
    Busy,
}

pub struct Cluster {
    pub id: Option<String>,
    pub status: ClusterStatus,
    pub manager: Option<Addr<Manager>>,
}

impl Default for Cluster {
    fn default() -> Cluster {
        Cluster {
            id: None,
            status: ClusterStatus::New,
            manager: None,
        }
    }
}

#[derive(Message)]
#[rtype(result = "<String, std::io::Error>")]
struct GetId;

impl Actor for Cluster {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Context<Self>) {
        info!(&GLOBAL.logger, "Started cluster {:?}", self.id);
        self.status = ClusterStatus::Starting;
    }

    fn stopped(&mut self, ctx: &mut Context<Self>) {
        info!(&GLOBAL.logger, "Stopped cluster {:?}", self.id);
    }
}

impl Handler<GetId> for Cluster {
    type Result = Result<String, std::io::Error>;

    fn handle(&mut self, msg: GetId, ctx: &mut Context<Self>) -> Self::Result {
        self.id.ok_or(Error("id not set".to_string()))
    }
}
