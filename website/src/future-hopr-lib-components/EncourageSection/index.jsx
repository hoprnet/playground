import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Section from '../Section/index.jsx'
import Typography from "../Typography/index.jsx";
import lottie from "lottie-web";

const Container = styled.div`
  display: flex;
  gap: 24px;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`

const Left = styled.div`
  flex: 5;
  display: flex;
  justify-content: center;
`

const Right = styled.div`
  flex: 6;
  display: flex;
  align-items: center;
`

const Animation = styled.div`
  max-width: 300px;
  max-height: 300px;
  overflow: hidden;
`

function EncourageSection(props) {
    const htmlId = 'encourage-animation';
    const animationLoaded = useRef(false);

    useEffect(() => {
        if (!animationLoaded.current) {
            lottie.loadAnimation({
                container: document.querySelector(`#${htmlId}`),
                animationData: props.animationData,
        });
        }
        animationLoaded.current = true;
    }, []);


    return (
        <Section
            className={`EncourageSectionSection ${props.className}`}
            id={props.id}
        >
            <Typography type="h2" center fullWidth>
                {props.title}
            </Typography>
            <Container>
                <Left>
                    <Animation id={htmlId}/>
                </Left>
                <Right>
                    <Typography center>
                        {props.text}
                    </Typography>
                </Right>
            </Container>

        </Section>
    );
}

export default EncourageSection;
