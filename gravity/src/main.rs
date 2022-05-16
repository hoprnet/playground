use actix_web::{error, get, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use tera::{Context, Tera};

struct AppState {
    template: Tera,
}

#[get("/")]
async fn index(req: HttpRequest) -> Result<HttpResponse, Error> {
    let data = req.app_data::<web::Data<AppState>>().unwrap();
    let s = data
        .template
        .render("index.html", &Context::new())
        .map_err(|_| error::ErrorInternalServerError("Template error"))?;

    Ok(HttpResponse::Ok().content_type("text/html").body(s))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let templates_glob = concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*");
    let tera = match Tera::new(templates_glob) {
        Ok(t) => t,
        Err(e) => {
            println!("Parsing error(s): {}", e);
            ::std::process::exit(1);
        }
    };
    let app_data = web::Data::new(AppState { template: tera });

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::clone(&app_data))
            .service(index)
    })
    .bind(("127.0.0.1", 18080))?
    .run()
    .await
}
