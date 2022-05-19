use clap::Parser;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct Args {
    /// Simulate running clusters in memory instead of using kubernetes
    #[clap(short, long)]
    pub simulate: bool,

    /// Default cluster size which may be overwritten by configuration
    #[clap(short, long)]
    pub cluster_count: i32,
}

pub fn parse() -> Args {
    Args::parse()
}
