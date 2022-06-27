import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";

import Section from '../../future-hopr-lib-components/Section/index.jsx'
import Typography from '../../future-hopr-lib-components/Typography/index.jsx'

import HoprBall from './hopr-ball.svg';

import lottie from "lottie-web";

const SSection = styled(Section)`
  padding-bottom: 80px;
  padding-top: 0;
`

const ImageContainer = styled.div`
  max-width: 780px;
  width: 100%;
  position: relative;
`

const Animation = styled.div`
  max-width: 780px;
  width: 100%;
  position: absolute;
  top: -42px;
  transition: all 1s;
  overflow: hidden;
  @media screen and (min-width: 360px) {
    top: -78px;
  }
  @media screen and (min-width: 600px) {
    top: -136px;
  }
  @media screen and (min-width: 830px) {
    top: -217px;
  }
`

const Subtext = styled(Typography)`
  max-width: 640px;
`

function Hero(props) {
    const animationLoaded = useRef(false);

    useEffect(() => {
        if (!animationLoaded.current) {
            lottie.loadAnimation({
                container: document.querySelector(`#hero-animation`),
                animationData: props.animation,
            });
        }
        animationLoaded.current = true;
    }, []);

    return (
        <SSection
            id={'Section1'}
            gradient
            center
        >
            <ImageContainer >
                <HoprBall/>
                <Animation id='hero-animation' />
            </ImageContainer>

            <Typography type="h2" center>
                Welcome to the HOPR Playground, where you can try out the HOPR protocol on a remotely hosted node network.
            </Typography>

        </SSection>
    );
}

export default Hero;
