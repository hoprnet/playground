import React, { useEffect, useRef, useState } from "react";
import { isSSR, getUrlParams, secondsToTime } from "../src/utils";

// Components
import Layout from "../src/future-hopr-lib-components/Layout";
import Introduction from "../src/pages/introduction";
import Cluster from "../src/pages/cluster";

//Data
import placeholderResponse from "../src/data/placeholderActivationResponse.json";
import { dapps } from "../src/data/dapps";
const { NEXT_PUBLIC_API_ENDPOINT } = process.env;
import placeholderMacIcons from "../src/data/placeholderMacIcons.json";

//Types
import type { NextPage } from "next";
import { Clusters, ClustersAvailability, Apps } from "../src/types";

const Index: NextPage = () => {
  const clusterOn = useRef(false);
  const devOnly = useRef(false); //for DEV purposes
  const [clusters, set_clusters] = useState<Clusters>([]);
  const [peerIds, set_peerIds] = useState<string[]>([]);
  const [clustersValidUntil, set_clustersValidUntil] = useState<number>(0);
  const [clustersAvailability, set_clustersAvailability] =
    useState<ClustersAvailability>({
      total: 0,
      used: 0,
      available: devOnly.current ? 1 : 0,
      secondsUntilRelease: 0,
    });
  const urlParams = !isSSR ? getUrlParams(location) : {};
  const api_url = urlParams.api || NEXT_PUBLIC_API_ENDPOINT || "";

  useEffect(() => {
    // Pre-release redirect
    if (process.env.NEXT_PUBLIC_REDIRECT === "1") {
      window.location.replace("https://hoprnet.org/");
    }

    //Get clusters from localStorage
    if (localStorage["clustersValidUntil"]) {
      const leftSeconds =
        parseInt(localStorage["clustersValidUntil"]) - Date.now() / 1000;
      if (leftSeconds > 60) {
        clusterOn.current = true;
        set_clustersValidUntil(parseInt(localStorage["clustersValidUntil"]));
        set_clusters(JSON.parse(localStorage["clusters"]));
      }
    }

    //Get clusters
    getClusterAvailability();
    const interval = setInterval(() => {
      if (!clusterOn.current) {
        getClusterAvailability();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (clusters.length > 0) {
      getPeerIds(clusters);
    }
  }, [clusters]);

  const getClusterAvailability = () => {
    const api_url_clusters = `${api_url}/api/clusters`;
    const req = new Request(api_url_clusters);
    fetch(req)
      .then((response) => response.json())
      .then((data) => {
        //console.log(`/clusters Resp:`, data);
        set_clustersAvailability({
          total: data.total_clusters_count,
          used: data.total_clusters_count - data.free_clusters_count,
          available: data.free_clusters_count,
          secondsUntilRelease: data.seconds_until_release,
        });
      })
      .catch((err) => {
        console.error(`API call failed with ${err}`);
      });
  };

  const launchCluster = () => {
    console.log(`launchCluster`);
    const api_url_clusters = `${api_url}/api/clusters/activate`;
    console.log(`Calling API at ${api_url_clusters}`);

    const req = new Request(api_url_clusters);
    fetch(req, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log(`/activate Resp:`, data);
        clusterOn.current = true;
        set_clusters(data.cluster_nodes);
        set_clustersValidUntil(data.cluster_valid_until);
        localStorage.setItem("clusters", JSON.stringify(data.cluster_nodes));
        localStorage.setItem("clustersValidUntil", data.cluster_valid_until);
      })
      .catch((err) => {
        console.error(`API call failed with ${err}`);
      });

    // DEV only
    if(devOnly.current){
      clusterOn.current = true;
      set_clusters(placeholderResponse.cluster_nodes);
    }
  };

  const getPeerIds = async (clusters: Clusters) => {
    setTimeout(async () => {
      let peerIdsTmp: string[] = [];
      for (let i = 0; i < clusters.length; i++) {
        //  for (let i = 0; i < 2; i++){
        console.log("clusters", clusters);
        //       const req = new Request();
        await fetch(`${clusters[i].api_url}/api/v2/account/addresses`, {
          method: "GET",
          headers: {
            accept: "*/*",
            authorization: `Basic ${btoa(clusters[i].api_token)}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            peerIdsTmp.push(data.hoprAddress);
          })
          .catch((err) => {
            console.error(`API call failed with ${err}`);
          });
      }

      if (peerIdsTmp.length !== clusters.length) {
        await getPeerIds(clusters);
      } else {
        console.log("peerIds", peerIdsTmp);
        set_peerIds(peerIdsTmp);
      }
    }, 1000);
  };

  const parseApps = (apps: Apps, clusters: Clusters) => {
    let nodeUrlParams = [];
    for (let i = 0; i < clusters.length; i++) {
      nodeUrlParams.push(
        `?apiEndpoint=${encodeURIComponent(
          clusters[i].api_url
        )}&apiToken=${encodeURIComponent(clusters[i].api_token)}`
      );
    }

    let parsedApps = [];
    for (let i = 0; i < apps.length; i++) {
      let icon: string | undefined = placeholderMacIcons[i].icon;
      if (apps[i].icon) icon = apps[i].icon;

      let dAppUrls: string[] = [];
      if (apps[i].key === "hoprd-admin") {
        dAppUrls = clusters.map(
            (cluster) =>
                cluster.admin_url +
                `?apiEndpoint=${encodeURIComponent(
                    cluster.api_url
                )}&apiToken=${encodeURIComponent(cluster.api_token)}`
        )
      } else {
        dAppUrls = nodeUrlParams.map((params) => apps[i].url + params);
      }

      parsedApps.push({
        key: apps[i].key,
        name: apps[i].name,
        text: apps[i].text,
        apiTokens: clusters.map((cluster) => cluster.api_token),
        apiEndpoint: clusters.map((cluster) => cluster.api_url),
        icon,
        dAppUrls,
      });
    }
    return parsedApps;
  };

  return (
    <Layout>
      {!clusterOn.current ? (
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
          peerIds={peerIds}
          dev={devOnly.current}
        />
      )}
    </Layout>
  );
};

export default Index;
