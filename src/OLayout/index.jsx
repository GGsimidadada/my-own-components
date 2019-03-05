import React, { Component } from 'react';
import './style';
import { Layout } from 'antd';
import OSpin from '../OSpin';
const { Header, Content, Sider } = Layout;

class OLayout extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { header, sider, loading, ospin } = this.props;

    return (
      <Layout className = 'o-layout' >
        { header && 
          <Header
            className = 'o-header'
          >
            { header }
            <OSpin loading = { loading } { ...ospin } />
          </Header>
        }
        <Layout>
          <Content
            className = 'o-content'
          >
            { this.props.children }
          </Content>
          { sider && 
            <Sider
              className = 'o-sider'
            >
              { sider }
            </Sider>
          }
        </Layout>
      </Layout>
    );
  }
}

export default OLayout;