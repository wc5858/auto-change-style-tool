import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Dashboard from './router/dashboard';
import Style from './router/style';
import Color from './router/color';
import Cp from './router/component';
import Catcher from './router/catcher';
import SelectLang from '../../../component/selectLang';
import { withTranslation } from 'react-i18next';
import { Menu, Icon, Layout } from 'antd';
const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    let current;
    const name = this.props.url.replace('/', '');
    const { t } = this.props;
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu
            defaultSelectedKeys={[name || 'dashboard']}
            defaultOpenKeys={['tools']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="dashboard">
              <Link to="/">
                <Icon type="dashboard" />
                <span>{t('主页')}</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="tools"
              title={
                <span>
                  <Icon type="tool" />
                  <span>{t('工作站')}</span>
                </span>
              }
            >
              <Menu.Item key="style">
                <Link to="/style">{t('更换风格')}</Link>
              </Menu.Item>
              <Menu.Item key="color">
                <Link to="/color">{t('色彩数据')}</Link>
              </Menu.Item>
              <Menu.Item key="component">
                <Link to="/component">{t('组件数据')}</Link>
              </Menu.Item>
              <Menu.Item key="/catcher">
                <Link to="/catcher">{t('事件捕捉')}</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="team">
              <Icon type="team" />
              <span>{t('团队')}</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0 20px' }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              style={{
                verticalAlign: '2px'
              }}
              onClick={this.toggleCollapsed}
            />
            <span style={{
              color: '#0d1a26',
              fontSize: 30,
              marginLeft: 20
            }}>{t('前端风格自动替换工具')}</span>
            <div style={{
              float: 'right'
            }}>
              <SelectLang/>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 'calc(100vh - 112px)'
            }}
          >
            <Switch>
              <Route path="/catcher" component={Catcher} />
              <Route path="/component" component={Cp} />
              <Route path="/color" component={Color} />
              <Route path="/style" component={Style} />
              <Route path="/" component={Dashboard} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withTranslation()(App);
