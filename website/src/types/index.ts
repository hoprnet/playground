export type State = {
    page: "introduction" | "playground";
    clusters: {
        total: number;
        used: number;
        available: number;
        secondsUntilRelease: number; // seconds
    };
    cluster: {
        name: string,
        secondsRemaining: number; // seconds
        apps: {
            [app: string]: string[];
        };
    };
};

export type Cluster = {
    api_url: string,
    admin_url: string,
    api_token: string
}

export type Clusters = Cluster[];

export type App = {
    key?: string;
    name?: string;
    url?: string;
    icon?: string;
    nodes?: string[];
    author?: string;
    links?: string[];
}

export type Apps = App[];

export type ClustersAvailability = {
    total: number;
    used: number;
    available: number;
    secondsUntilRelease: number; // seconds
}



