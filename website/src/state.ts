import 'process';

import { useState, useEffect } from "react";
import useWebsocket from "./hooks/useWebsocket";
import { isSSR, getUrlParams } from "./utils";

const { NEXT_PUBLIC_API_ENDPOINT } = process.env

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

const useAppState = () => {
  const urlParams = !isSSR ? getUrlParams(location) : {};
  // set initial state
  const [state, setState] = useState<State>({
    page: "introduction",
    clusters: {
      total: 0,
      used: 0,
      available: 0,
      secondsUntilRelease: 0,
    },
    cluster: {
      secondsRemaining: 0,
      apps: {},
    },
  });
  const api_url = urlParams.api || NEXT_PUBLIC_API_ENDPOINT || "";
  console.log(`urlParams.api: ${urlParams.api}`)
  console.log(`API_ENDPOINT: ${NEXT_PUBLIC_API_ENDPOINT}`)
  console.log(`api_url: ${api_url}`)

  const api_url_clusters = `${api_url}/api/clusters`;
  console.log(`Calling API at ${api_url_clusters}`);

  const req = new Request(api_url_clusters);
  fetch(req)
      .then(response => response.json())
      .then(data => {
          setState((draft) => {
            draft.clusters.total = data.total_clusters_count;
            draft.clusters.used = data.total_clusters_count - data.free_clusters_count;
            draft.clusters.available = data.free_clusters_count;
            draft.clusters.secondsUntilRelease = data.seconds_until_release;
            return draft;
          });
        })
    .catch(err => {
      console.error(`API call failed with ${err}`)
    });

  useEffect(() => {
  }, []);

  // launch cluster
  const launchCluster = () => {
    const api_url = urlParams.api || API_ENDPOINT || "";
    const api_url_clusters = `${api_url}/api/clusters/activate`;
  console.log(`Calling API at ${api_url_clusters}`);

  const req = new Request(api_url_clusters);
  fetch(req, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
          setState((draft) => {
            draft.page = "playground";
            return draft;
          });
        })
    .catch(err => {
      console.error(`API call failed with ${err}`)
    });
  };

  return {
    state,
    launchCluster,
  };
};

export default useAppState;
