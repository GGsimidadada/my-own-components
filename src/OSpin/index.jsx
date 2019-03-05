import React, { Component } from 'react';
import './style';
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class OSpin extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { style, loading, ...others } = this.props;
    return (
      loading ? 
        <div className = 'o-spin-box' style = { style } >
          <Spin indicator = { antIcon } { ...others } />
        </div>
        :
        null
    );
  }
}

export default OSpin;