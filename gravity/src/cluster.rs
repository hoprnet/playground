enum ClusterStatus {
    Starting
    Ready
    Busy
}

struct Cluster {
    pub status: ClusterStatus,
    pub id: str,
}

impl Cluster {
    pub fn new(id: String) -> Self {
        Self {
            id,
            status: ClusterStatus::Starting,
        }
    }
}
