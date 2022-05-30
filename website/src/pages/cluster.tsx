import type { State } from "../state";
import { useState, useMemo } from "react";
import styles from "../../styles/pages/cluster.module.scss";
import Gradient from "../components/gradient";
import Playground from "../components/playground";
import LinkHolder from "../components/link-holder";
import { secondsToTime } from "../utils";

const Cluster = (props: { cluster: State["cluster"] }) => {
  const [selection, setSelection] = useState<string>();
  // time remaining until release - computed via secondsRemaining
  // used a memo here incase we introduce a countdown later
  const timeRemaining: string = useMemo(() => {
    return secondsToTime(props.cluster.secondsRemaining);
  }, [props.cluster.secondsRemaining]);

  const apps = Object.entries(props.cluster.apps);
  const links = selection ? props.cluster.apps[selection] : [];
  console.log(links);

  return (
    <div className="container">
      <Gradient />

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
      <div className={`container section ${styles.apps}`}>
        {apps.map(([name]) => (
          <div
            key={name}
            onClick={() => {
              console.log("name", name);
              setSelection(name);
            }}
            className={`${styles.appBox} ${
              selection === name ? styles.selected : ""
            }`}
          >
            {name}
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default Cluster;
