import type { State } from "../state";
import { useMemo } from "react";
import styles from "../../styles/pages/introduction.module.scss";
import Button from "../components/button";
import { secondsToTime } from "../utils";
import Hero from '../future-hopr-lib-components/Hero'
import EncourageSection from "../future-hopr-lib-components/EncourageSection/index.jsx";
import playgroundAnimation from '../animation/playground.json'
import typingBotAnimation from '../animation/typing-bot-animation.json';

const Introduction = (props: {
  clusters: State["clusters"];
  launchCluster: () => void;
}) => {
  console.log("props.clusters", props.clusters)
  const hasAvailableCluster = props.clusters.available > 0;
  // time remaining until release - computed via secondsUntilRelease
  // used a memo here incase we introduce a countdown later
  const timeUntilRelease: string = useMemo(() => {
    return secondsToTime(props.clusters.secondsUntilRelease);
  }, [props.clusters.secondsUntilRelease]);

  return (
    <div>
      <Hero
        animation={playgroundAnimation}
      />

      {/* clusters section */}
      <div className={`container section bottomGap ${styles.clusters}`}>
        <div className={styles.textWrapper}>
          {hasAvailableCluster ? (
            <>
              <span>
                Currently{" "}
                <span className="highlight">{props.clusters.used}</span>{" "}
                clusters are in use.
              </span>
              <span>
                <span className="highlight">{props.clusters.available}</span>{" "}
                clusters are available for you.
              </span>
            </>
          ) : (
            <div className={styles.centerParagraph}>
              <p>Currently all clusters are in use.<br/>
                Please wait for{" "}
                <span className="highlight">{timeUntilRelease}</span>. All{" "}
                <span className="highlight">{props.clusters.total}</span>{" "}
                clusters will then be allocated to new users.
              </p>
            </div>
          )}
        </div>
        {hasAvailableCluster ? (
          <Button onClick={() => props.launchCluster()}>
            <span
              style={{
                fontSize: "25px",
                color: "white",
              }}
            >
              LAUNCH CLUSTER
            </span>
          </Button>
        ) : null}
      </div>

      {!hasAvailableCluster ? (
        <div className="container section topLgGap">
          <div className="titleText" style={{ textAlign: "center" }}>
            WHAT IS THE HOPR PROTOCOL?
          </div>
          <div className={`container topGap ${styles.video}`}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/2ftZdR09KbU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : null}

      <EncourageSection
          title='BE PART OF THE HOPR ECOSYSTEM'
          text='HOPR is building the transport layer privacy needed to make web3 work. Work with us to build dApps that change data privacy for good.'
          animationData={typingBotAnimation}
      />
    </div>
  );
};

export default Introduction;
