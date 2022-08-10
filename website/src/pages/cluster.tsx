import React, { useState, useMemo, useEffect } from "react";
import Router from 'next/router'
import styles from "../../styles/pages/cluster.module.scss";
import { secondsToTime } from "../utils";

//Components
import Playground from "../components/playground";
import LinkHolder from "../components/link-holder";
import Section from "../future-hopr-lib-components/Section"
import Dock from "../future-hopr-lib-components/Dock"
import CopyButton from '../future-hopr-lib-components/CopyButton'

//Types
import { App, Apps, Clusters, ClustersAvailability, Links } from '../types'

const Cluster = (props: {
  clustersAvailability: ClustersAvailability
  apps: Apps,
  clusters: Clusters,
  clustersValidUntil: number,
  peerIds: string[]
}) => {
  const [selection, set_selection] = useState<number>(-1);
  const [timeRemaining, set_timeRemaining] = useState<string>('20:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const leftSeconds = props.clustersValidUntil - Date.now()/1000;
      if(leftSeconds < 0) {
        // @ts-ignore
        Router.reload(window.location.pathname);
      } else {
        set_timeRemaining(secondsToTime(Math.floor(leftSeconds)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const links: Links = selection !== -1 ? props.apps[selection].links : [];

  return (
    <Section
        gradient
    >
      {/* welcome section */}
      <div className={`container section ${styles.welcome}`}>
        <Playground />
        <div>
          Welcome to your playground – your cluster has started! You can now
          choose one of the dApps below and start exploring it.
          <br />
          <br />
          Be aware that your session will be terminated automatically after 20
          minutes. Time remaining:{" "}
          <span className="highlight">{timeRemaining}</span>.
        </div>
      </div>

      {/* show apps */}
      <div className={styles.dAppDockTitle}><strong>dApp Dock</strong></div>
      <Dock
        apps={props.apps}
        iconClicked={set_selection}
      />

      <div className={`container section topGap ${styles.linksContainer}`}>
        <div className={`${styles.appTitle}`}>
          {selection !== -1 ? props.apps[selection].name : ''}
        </div>
        <div>
          The HOPR network is a decentralized incentivized mixnet, ensuring
          complete data and metadata privacy for everyone who uses it. Data is
          sent via multiple hops, so no-one but the sender and receiver know the
          origin, destination, or content of a data transfer.
          <br />
          <br />
          <br />
          Hoprd allows you to open channels, send one, two or three hop messages
          as well as check your balance and much more. Check docs.hoprnet.org
          for all available commands.
        </div>
        <div className={`bottomGap topGap ${styles.links}`}>
          {links?.map((link, index) => (
              <>
                <div className={`${styles.nodeDetails}`}>
                  <div className={styles.nodeDetailsLine}><strong>Node {index}</strong></div>
                  <div className={styles.nodeDetailsLine}>
                    <div className={styles.nodeDetailsTitle}><strong>Url:</strong></div>
                    <div className={styles.nodeDetailsData}><a href={link} target="_blank" rel="noreferrer" >{link}</a></div>
                    <div className={styles.nodeDetailsCopy}><CopyButton copy={link}/></div>
                  </div>
                  <div className={styles.nodeDetailsLine}>
                    <div className={styles.nodeDetailsTitle}><strong>Peer ID:</strong></div>
                    <div className={styles.nodeDetailsData}>{props.peerIds?.length > 0 ? props.peerIds[index] : 'loading...' }</div>
                    {props.peerIds[index] && <div className={styles.nodeDetailsCopy}><CopyButton copy={props.peerIds[index]}/></div>}
                  </div>
                  {
                    selection !== -1 && props.apps[selection].name === 'hoprd-admin' &&
                    <div className={styles.nodeDetailsLine}>
                      <div className={styles.nodeDetailsTitle}><strong>API key:</strong></div>
                      <div className={styles.nodeDetailsData}>{props.clusters[index].api_token}</div>
                      <div className={styles.nodeDetailsCopy}><CopyButton copy={props.clusters[index].api_token}/></div>
                    </div>
                  }
                </div>
              </>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Cluster;
