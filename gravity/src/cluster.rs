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
    pub id: String,
    pub status: ClusterStatus,
    pub manager: Addr<Manager>,
}

#[derive(Message)]
#[rtype(result = "Result<String, String>")]
pub struct GetId;

impl Cluster {
    pub fn new(id: String, manager: Addr<Manager>) -> Self {
        Self {
            id,
            manager,
            status: ClusterStatus::New,
        }
    }
}

impl Actor for Cluster {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Context<Self>) {
        info!(&GLOBAL.logger, "Started cluster {:?}", self.id);
        self.status = ClusterStatus::Starting;
    }

    fn stopped(&mut self, _ctx: &mut Context<Self>) {
        info!(&GLOBAL.logger, "Stopped cluster {:?}", self.id);
    }
}

impl Handler<GetId> for Cluster {
    type Result = Result<String, String>;

    fn handle(&mut self, _msg: GetId, _ctx: &mut Context<Self>) -> Self::Result {
        Ok(self.id.clone())
        // match &self.id {
        //     Some(id) => Ok(id.clone()),
        //     None => Err(())
        // }
    }
}
