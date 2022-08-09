import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import lottie from "lottie-web";
import styles from "../../styles/components/playground.module.scss";
import playgroundAnimation from '../animation/playground.json'

const Animation = styled.div`
`

const Playground = () => {
  const animationLoaded = useRef(false);

  useEffect(() => {
    if (!animationLoaded.current) {
      lottie.loadAnimation({
        container: document.querySelector(`#hero-animation`),
        animationData: playgroundAnimation,
      });
    }
    animationLoaded.current = true;
  }, []);

  return (
    <div className={styles.yellowCircle}>
      <Animation id='hero-animation' />
    </div>
  );
};

export default Playground;
