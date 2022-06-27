import React from 'react';
import styled from "@emotion/styled";

const SNavBar = styled.div`
  height: 68px;
  position: fixed;
  top: 0;
  width: 100vw;
  background: white;
  z-index: 10;
`

const Container = styled.div`
  height: 100%;
  max-width: 1096px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @media screen and (max-width: 600px) {
    justify-content: flex-start;
  }
`

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  margin-left: 10px;
  @media screen and (min-width: 601px) {
    position: absolute;
    left: 0;
  }
`

const Title = styled.div`
  font-size: 32px;
  text-transform: uppercase;
  margin-left: 10px;
  margin-right: 10px;
`

const NavBar = ({
    title
}) => {
  return (
    <SNavBar>
      <Container>
        <LogoImage
          alt="Hopr logo"
          src="/logo.svg"
        />
        {
          title &&
          <Title>
              {title}
          </Title>
        }
      </Container>
    </SNavBar>
  );
};

export default NavBar;
