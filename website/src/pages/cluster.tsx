import React, { useState, useMemo, useEffect } from "react";
import Router from 'next/router'
import styles from "../../styles/pages/cluster.module.scss";
import { secondsToTime } from "../utils";

//Components
import Playground from "../components/playground";
import LinkHolder from "../components/link-holder";
import Section from "../future-hopr-lib-components/Section"
import Dock from "../future-hopr-lib-components/Dock"

//Types
import { App, Apps, Clusters, ClustersAvailability, Links } from '../types'

const Cluster = (props: {
  clustersAvailability: ClustersAvailability
  apps: Apps,
  clusters: Clusters,
  clustersValidUntil: number,
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
      <Dock
        apps={props.apps}
        iconClicked={set_selection}
      />

      <div className={`container section topGap ${styles.linksContainer}`}>
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
            <LinkHolder key={link} nodeNumber={index} link={link} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Cluster;
