import React, { useState } from "react";
import type { NextPage } from "next";
import Navbar from "../src/components/navbar";
// import Footer from "../src/components/footer";

import Introduction from "../src/pages/introduction";
import Cluster from "../src/pages/cluster";
import useAppState, {State} from "../src/state";
import styles from "../styles/index.module.scss";

import Layout from '../src/future-hopr-lib-components/Layout'

//Data
import placeholderResponse from '../src/data/placeholderActivationResponse.json'
import { dapps } from '../src/data/dapps'

//Types
import { Clusters, Apps } from '../src/types'

const Index: NextPage = () => {
  const { state } = useAppState();
  const [clusterOn, set_clusterOn] = useState<boolean>(false);
  const [clusters, set_clusters] = useState<Clusters>([]);

  const launchCluster = () => {
    console.log(`launchCluster`);
    set_clusterOn(true);
    set_clusters(placeholderResponse.cluster_nodes);
  };

  return (
    <Layout>
      { !clusterOn ? (
        <Introduction
          clusters={state.clusters}
          launchCluster={launchCluster}
        />
      ) : (
        <Cluster
            cluster={state.cluster}
            clusters={clusters}
            apps={dapps}
        />
      )}
    </Layout>
  );
};

export default Index;
