import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Home from './router/home';
import Color from './router/color';
import Cp from './router/component';

import { Menu, Icon } from 'antd';

class App extends React.Component {
  state = {
    current: this.props.url.replace('/', '') || 'home'
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    const { current } = this.state;
    return (
      <div>
        <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="home">
            <Link to="/">
              <Icon type="bulb" />更换风格
            </Link>
          </Menu.Item>
          <Menu.Item key="color">
            <Link to="/color">
              <Icon type="bg-colors" />色彩数据
            </Link>
          </Menu.Item>
          <Menu.Item key="component">
            <Link to="/component">
              <Icon type="build" />组件数据
            </Link>
          </Menu.Item>
        </Menu>
        <Switch>
          <Route path="/component" component={Cp} />
          <Route path="/color" component={Color} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
