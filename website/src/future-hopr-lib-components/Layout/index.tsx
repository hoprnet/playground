// Packages
import React from 'react';
import styled from '@emotion/styled'

// Components
import NavBar from './navbar';
import Footer from './footer';


const SLayout = styled.div`

`

const Content = styled.div`
  margin-top: 68px;
`

const Layout: React.FC<{ children?: any }> = (props) => {
    return (
        <SLayout className="Layout">
            <NavBar title="Playground" />
            <Content className="Content">
                {props.children}
            </Content>
            <Footer />
        </SLayout>
    );
};

export default Layout;
