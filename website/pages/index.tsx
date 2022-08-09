import React, { useEffect, useState } from "react";
import { isSSR, getUrlParams, secondsToTime } from "../src/utils";

// Components
import Layout from '../src/future-hopr-lib-components/Layout'
import Introduction from "../src/pages/introduction";
import Cluster from "../src/pages/cluster";

//Data
import placeholderResponse from '../src/data/placeholderActivationResponse.json';
import { dapps } from '../src/data/dapps';
const { NEXT_PUBLIC_API_ENDPOINT } = process.env;
import placeholderMacIcons from "../src/data/placeholderMacIcons.json";

//Types
import type { NextPage } from "next";
import {Clusters, ClustersAvailability, Apps} from '../src/types'


const Index: NextPage = () => {
  const [clusterOn, set_clusterOn] = useState<boolean>(false);
  const [clusters, set_clusters] = useState<Clusters>([]);
  const [clustersValidUntil, set_clustersValidUntil] = useState<number>(0);
  const [clustersAvailability, set_clustersAvailability] = useState<ClustersAvailability>({
      total: 0,
      used: 0,
      available: 0,
   //  available: 1, //dev
      secondsUntilRelease: 0,
  });
  const urlParams = !isSSR ? getUrlParams(location) : {};
  const api_url = urlParams.api || NEXT_PUBLIC_API_ENDPOINT || "";

    useEffect(() => {
        getClusterAvailability();
        const interval = setInterval(() => {
            getClusterAvailability();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

  const getClusterAvailability = () => {
      const api_url_clusters = `${api_url}/api/clusters`;
      const req = new Request(api_url_clusters);
      fetch(req)
          .then(response => response.json())
          .then(data => {
              console.log(`/clusters Resp:`, data);
              set_clustersAvailability({
                  total: data.total_clusters_count,
                  used: data.total_clusters_count - data.free_clusters_count,
                  available: data.free_clusters_count,
                  secondsUntilRelease: data.seconds_until_release,
              });
          })
          .catch(err => {
              console.error(`API call failed with ${err}`)
          });
  }

  const launchCluster = () => {
    console.log(`launchCluster`);
    const api_url_clusters = `${api_url}/api/clusters/activate`;
    console.log(`Calling API at ${api_url_clusters}`);

    const req = new Request(api_url_clusters);
    fetch(req, { method: 'POST'})
        .then(response => response.json())
        .then(data => {
          console.log(`/activate Resp:`, data);
          set_clusterOn(true);
          set_clusters(data.cluster_nodes);
          set_clustersValidUntil(data.cluster_valid_until);
        })
        .catch(err => {
          console.error(`API call failed with ${err}`)
        });

    // DEV only
    // set_clusterOn(true);
    // set_clusters(placeholderResponse.cluster_nodes);
  };

  const parseApps = (apps: Apps, clusters: Clusters) => {
    console.log('parseApps', apps, clusters);

    let nodeUrlParams = [];
    for (let i = 0; i < clusters.length; i++) {
      nodeUrlParams.push(`?apiEndpoint=${encodeURIComponent(clusters[i].api_url)}&apiToken=${encodeURIComponent(clusters[i].api_token)}`)
    }

    let parsedApps = [];
    for (let i = 0; i < apps.length; i++) {
      let icon: string | undefined = placeholderMacIcons[i].icon;
      if (apps[i].icon) icon = apps[i].icon;
      parsedApps.push(
          {
            key: apps[i].key,
            name: apps[i].name,
            icon,
            links: nodeUrlParams.map(params => apps[i].url + params)
          }
      )
    }

    console.log('parsedApps', parsedApps);
    return parsedApps;
  }

  return (
    <Layout>
      { !clusterOn ? (
        <Introduction
          clusters={clustersAvailability}
          launchCluster={launchCluster}
        />
      ) : (
        <Cluster
            clustersAvailability={clustersAvailability}
            clusters={clusters}
            apps={parseApps(dapps, clusters)}
            clustersValidUntil={clustersValidUntil}
        />
      )}
    </Layout>
  );
};

export default Index;
