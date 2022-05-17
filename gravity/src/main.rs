use crate::cluster::Cluster;
use actix::{Actor, StreamHandler};
use actix_web::{middleware::Logger, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use once_cell::sync::Lazy;
use slog::{error, info};
use sloggers::terminal::{Destination, TerminalLoggerBuilder};
use sloggers::types::Severity;
use sloggers::Build;
use std::collections::HashMap;
use tera::{Context, Tera};

#[derive(Debug)]
pub struct Global {
    pub logger: slog::Logger,
    pub template: Tera,
}

struct Clusters {
    pub starting: HashMap<str, Cluster>,
    pub ready: HashMap<str, Cluster>,
    pub busy: HashMap<str, Cluster>,
}

pub static GLOBAL: Lazy<Global> = Lazy::new(|| {
    let mut builder = TerminalLoggerBuilder::new();
    builder.level(Severity::Debug);
    builder.destination(Destination::Stderr);

    let logger = builder.build().unwrap();
    info!(logger, "set up logger");

    let templates_glob = concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*");
    info!(logger, "loading html templates from {}", templates_glob);

    let template = match Tera::new(templates_glob) {
        Ok(t) => t,
        Err(e) => {
            println!("Parsing error(s): {}", e);
            ::std::process::exit(1);
        }
    };

    Global {
        logger: logger,
        template: template,
    }
});

struct StatusWebsocket;

impl Actor for StatusWebsocket {
    type Context = ws::WebsocketContext<Self>;
}

async fn index(_req: HttpRequest) -> Result<HttpResponse, Error> {
    let s = &GLOBAL
        .template
        .render("index.html", &Context::new())
        .map_err(|e| {
            error!(&GLOBAL.logger, "{}", e);
            actix_web::error::ErrorInternalServerError("Rendering error")
        })?;

    Ok(HttpResponse::Ok()
        .content_type("text/html")
        .body(s.to_string()))
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for StatusWebsocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        if msg.is_ok() {
            info!(&GLOBAL.logger, "Handling message on status websocket");
            match msg {
                Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
                Ok(ws::Message::Text(text)) => ctx.text(text),
                Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
                _ => (),
            }
        } else {
            info!(
                &GLOBAL.logger,
                "Passing through protocol error on status websocket: {}",
                msg.unwrap_err()
            );
        }
    }
}

async fn ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    info!(&GLOBAL.logger, "Opening status websocket connection");
    let resp = ws::start(StatusWebsocket {}, &req, stream);

    match resp {
        Ok(ref r) => {
            info!(
                &GLOBAL.logger,
                "Opened status websocket connection: {}",
                r.status()
            );
        }
        Err(ref e) => {
            error!(
                &GLOBAL.logger,
                "Failed opening status websocket connection: {}", e
            );
        }
    }

    resp
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let logger = &GLOBAL.logger;

    info!(logger, "starting http server");
    let host = "127.0.0.1";
    let port = 18080;
    let server = HttpServer::new(move || {
        App::new()
            .route("/", web::get().to(index))
            .route("/ws", web::get().to(ws))
            .wrap(Logger::default())
    })
    .bind((host, port))?
    .run();

    info!(logger, "started http server listening on {}:{}", host, port);

    server.await
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        http::{self, header::Accept},
        test,
    };

    #[actix_web::test]
    async fn test_index_ok() {
        let req = test::TestRequest::default()
            .insert_header(Accept::html())
            .to_http_request();
        let resp = index(req).await.unwrap();
        assert_eq!(resp.status(), http::StatusCode::OK);
    }
}
