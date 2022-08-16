import React, { useState, useMemo, useEffect } from "react";
import Router from "next/router";
import styles from "../../styles/pages/cluster.module.scss";
import { secondsToTime } from "../utils";

//Components
import Playground from "../components/playground";
import LinkHolder from "../components/link-holder";
import Section from "../future-hopr-lib-components/Section";
import Dock from "../future-hopr-lib-components/Dock";
import CopyButton from "../future-hopr-lib-components/CopyButton";
import NodeCard from "../components/node-card";

//Types
import { App, Apps, Clusters, ClustersAvailability, Links } from "../types";

const Cluster = (props: {
  clustersAvailability: ClustersAvailability;
  apps: Apps;
  clusters: Clusters;
  clustersValidUntil: number;
  peerIds: string[];
}) => {
  const [selection, set_selection] = useState<number>(-1);
  const [timeRemaining, set_timeRemaining] = useState<string>("20:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const leftSeconds = props.clustersValidUntil - Date.now() / 1000;
      if (leftSeconds < 0) {
        // @ts-ignore
        Router.reload(window.location.pathname);
      } else {
        set_timeRemaining(secondsToTime(Math.floor(leftSeconds)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dAppUrls: Links = selection !== -1 ? props.apps[selection].dAppUrls : [];

  return (
    <Section gradient>
      {/* welcome section */}
      <div className={`container section ${styles.welcome}`}>
        <Playground />
        <div>
          <div className={styles.dAppDockTitle}>WELCOME TO YOUR PLAYGROUND</div>
          Your cluster has started! You can now choose one of the dApps below
          and start exploring it. Be aware that your session will be terminated automatically after 20
          minutes. <br />
          <br />
          Time remaining: <span className="highlight">{timeRemaining}</span>
        </div>
      </div>

      {/* show apps */}
      <div className={styles.dAppDockTitle2}>
        <strong>dAPPS</strong>
      </div>
      <div className={styles.dAppDockSubtitle}>
        Choose which dApp you&apos;d like to play first
      </div>
      <Dock apps={props.apps} iconClicked={set_selection} />

      <div className={`container section topGap ${styles.linksContainer}`}>
        <div className={styles.dAppDockTitle}>
          {selection !== -1 ? props.apps[selection].name : ""}
        </div>
        <div className={styles.dAppTextContainer}>{selection !== -1 ? props.apps[selection].text : ""}</div>
        <div className={`bottomGap topGap ${styles.links}`}>
          {dAppUrls?.map((link, index) => (
              <NodeCard
                  index={index}
                  key={`dApp-Node-${index}`}
                  dAppUrl={props.apps[selection].key !== "own-dApp" && link}
                  peerId={props.peerIds[index]}
                  apiEndpoint={["own-dApp"].includes(props.apps[selection].key) && props.clusters[index].api_url}
                  apiToken={["hoprd-admin", "own-dApp"].includes(props.apps[selection].key) && props.clusters[index].api_token}
              />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Cluster;
