import { useEffect } from "react";
import Image from "next/image";
import lottie from "lottie-web";
import terminalRobotAnimation from "../animation/anim_robot_terminal.json";
import styles from "../../styles/components/playground.module.scss";

const Playground = () => {
  // nextjs remounts page on first load to properly hydrate it
  // this flag is to prevent loading animation twice
  let animationLoaded = false;
  useEffect(() => {
    // check to prevent double animation load on page remount
    if (!animationLoaded) {
      lottie.loadAnimation({
        container: document.querySelector("#terminalRobotAnimation")!,
        animationData: terminalRobotAnimation,
      });
    }
    animationLoaded = true;
  }, []);

  return (
    <div className={styles.yellowCircle}>
      <Image
        src="/hopr-playground.svg"
        width={250}
        height={250}
        className={styles.playgroundSvg}
      />
    </div>
  );
};

export default Playground;
