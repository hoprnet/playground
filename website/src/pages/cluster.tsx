import type { State } from "../state";
import { useState, useMemo } from "react";
import styles from "../../styles/pages/cluster.module.scss";
import Gradient from "../components/gradient";
import Playground from "../components/playground";
import LinkHolder from "../components/link-holder";
import { secondsToTime } from "../utils";

import Section from "../future-hopr-lib-components/Section"
import Dock from "../future-hopr-lib-components/Dock"

//Types
import { Apps, Clusters } from '../types'

const Cluster = (props: {
  cluster: State["cluster"],
  apps: Apps,
  clusters: Clusters
}) => {
  const [selection, setSelection] = useState<string>();
  // time remaining until release - computed via secondsRemaining
  // used a memo here incase we introduce a countdown later
  const timeRemaining: string = useMemo(() => {
    return secondsToTime(props.cluster.secondsRemaining);
  }, [props.cluster.secondsRemaining]);

  const apps = Object.entries(props.cluster.apps);
  const links = selection ? props.cluster.apps[selection] : [];
  console.log(links);

  const parseApps = (apps: Apps, clusters: Clusters) => {
    console.log('parseApps', apps, clusters);

    return {}
  }

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
        apps={parseApps(props.apps, props.clusters)}
        iconClicked={(index: number) => { setSelection(apps[index][0]) }}
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
          {links.map((link, index) => (
            <LinkHolder key={link} nodeNumber={index} link={link} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Cluster;
