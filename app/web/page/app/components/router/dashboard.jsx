import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Row, Card, Col, List, Button, message } from 'antd';
import Avatar from '../subComponents/avatar';
import { updateUserInfo } from '../store/actions';
import './dashboard.less';

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};


class Dashboard extends Component {

  cancel = async () => {
    const { updateUserInfo } = this.props;
    const res = await axios({
      method: 'post',
      url: '/api/v1/notification/cancel'
    });
    if (res.data.success) {
      const swReg = await navigator.serviceWorker.register('/public/sw.js');
      const subscription = await swReg.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        message.success('取消成功');
        updateUserInfo();
        return;
      }
    }
    message.success('取消失败');
  };

  subscribe = async () => {
    const { updateUserInfo } = this.props;
    if ('serviceWorker' in navigator) {
      const swReg = await navigator.serviceWorker.register('/public/sw.js');
      let subscription = await swReg.pushManager.getSubscription();
      if (!subscription) {
        const res = await axios({
          method: 'post',
          url: '/api/v1/notification/key'
        });
        if (!res.data.success) {
          message.error('订阅失败');
          return;
        }
        subscription = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(res.data.key)
        });
      }
      if (subscription) {
        const res = await axios({
          method: 'post',
          url: '/api/v1/notification/subscribe',
          data: subscription
        });
        if (res.data.success) {
          updateUserInfo();
          message.success('订阅成功');
          return;
        }
      }
    }
    message.error('订阅失败');
  };

  test = async () => {
    const res = await axios({
      method: 'post',
      url: '/api/v1/notification/test'
    });
  }


  render() {
    const { teamData, taskData, t, colorData, componentData, userInfo } = this.props;
    return <div className="redux-nav-item">
      {
        userInfo.subscribed ?
          <Button onClick={this.cancel}>取消订阅</Button> :
          <Button onClick={this.subscribe}>订阅提醒</Button>
      }
      {/* <Button onClick={this.test}>测试消息</Button> */}
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期任务')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {taskData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期颜色数据')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {colorData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期组件数据')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {componentData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
            bordered={false}
            title={t('团队')}
            loading={false}
          >
            <div className="dashboard-teams">
              <Row gutter={48}>
                {teamData.map(item => (
                  <Col span={12} key={item._id}>
                    <div className="dashboard-team">
                      <Avatar value={item.avatar} size="small" />
                      <span className="team-name">{item.teamName}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>;
  }
}

const mapStateToProps = state => ({
  teamData: state.teamData || [],
  taskData: state.taskData || [],
  colorData: state.colorData || [],
  componentData: state.componentData || [],
  userInfo: state.userInfo || {}
});

export default connect(mapStateToProps, { updateUserInfo })(withTranslation('translation', { withRef: true })(Dashboard));