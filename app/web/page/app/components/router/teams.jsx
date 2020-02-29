import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List, Card, Icon, Dropdown, Menu, Avatar, Tooltip, Button, Modal } from 'antd';
import { withTranslation } from 'react-i18next';
import CreateTeam from '../subComponents/createTeam';
import { createTeam } from '../store/actions';
import './teams.less';

class Teams extends PureComponent {
  state = {
    visible: false,
    loading: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    const { createTeam } = this.props;
    this.setState({ loading: true });
    this.refs.teamForm.validateFields((err, values) => {
      if (!err) {
        createTeam(values);
        this.setState({
          loading: false,
          visible: false
        });
        this.refs.teamForm.resetFields();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    // const {
    //   list: { list },
    // } = this.props;
    const { t } = this.props;
    const { visible, loading } = this.state;
    const list = [];
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    const CardInfo = ({ activeUser, newUser }) => (
      <div className="card-info">
        <div>
          <p>活跃用户</p>
          <p>{activeUser}</p>
        </div>
        <div>
          <p>新增用户</p>
          <p>{newUser}</p>
        </div>
      </div>
    );
    return (
      <div className="redux-nav-item">
        <Button type="primary" onClick={this.showModal}>
          {t('新建团队')}
        </Button>
        <List
          rowKey="id"
          className="filter-cardList"
          grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <Tooltip title="下载">
                    <Icon type="download" />
                  </Tooltip>,
                  <Tooltip title="编辑">
                    <Icon type="edit" />
                  </Tooltip>,
                  <Tooltip title="分享">
                    <Icon type="share-alt" />
                  </Tooltip>,
                  <Dropdown overlay={itemMenu}>
                    <Icon type="ellipsis" />
                  </Dropdown>
                ]}
              >
                <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
                <div className="card-item-content">
                  <div className="card-info">
                    <div>
                      <p>活跃用户</p>
                      <p>1</p>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Modal
          width={800}
          visible={visible}
          title={t('新建团队')}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <CreateTeam ref="teamForm" />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { createTeam })(withTranslation('translation', { withRef: true })(Teams));
