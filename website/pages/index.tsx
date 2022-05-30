import type { NextPage } from "next";
import Navbar from "../src/components/navbar";
// import Footer from "../src/components/footer";
import Introduction from "../src/pages/introduction";
import Cluster from "../src/pages/cluster";
import useAppState from "../src/state";
import styles from "../styles/index.module.scss";

const Index: NextPage = () => {
  const { state, launchCluster } = useAppState();

  return (
    <div className={`container ${styles.mainContainer}`}>
      <Navbar />
      {state.page === "introduction" ? (
        <Introduction clusters={state.clusters} launchCluster={launchCluster} />
      ) : (
        <Cluster cluster={state.cluster} />
      )}
      {/* Footer here disabled, uncomment to add */}
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
