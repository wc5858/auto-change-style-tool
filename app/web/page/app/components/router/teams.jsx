import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List, Card, Icon, Dropdown, Menu, Tooltip, Button, Modal } from 'antd';
import { withTranslation } from 'react-i18next';
import CreateTeam from '../subComponents/createTeam';
import { createTeam, findTeam, invite } from '../store/actions';
import Avatar from '../subComponents/avatar';
import './teams.less';
import InviteModal from '../subComponents/inviteModal';

class Teams extends PureComponent {
  state = {
    visible: false,
    loading: false,
    inviteVisible: false,
    inviteLoading: false,
    selectedId: ''
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  openInvite = id => {
    this.setState({
      inviteVisible: true,
      selectedId: id
    });
  };


  handleInviteOk = () => {
    const { userInfo, invite } = this.props;
    this.setState({ inviteLoading: true });
    this.refs.inviteModal.validateFields((err, values) => {
      if (!err) {
        invite({
          target: values.username,
          invitor: userInfo.username,
          teamId: this.state.selectedId
        });
        this.setState({
          inviteLoading: false,
          inviteVisible: false
        });
        this.refs.inviteModal.resetFields();
      } else {
        this.setState({ inviteLoading: false });
      }
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

  handleInviteCancel = () => {
    this.setState({ inviteVisible: false });
  };

  render() {
    const { data, userInfo, t } = this.props;
    const { visible, loading, inviteLoading, inviteVisible } = this.state;
    const namedAvatar = (name, avatarValue) => (
      <Tooltip title={name}>
        {/* Tooltip和value之间一定得加一层dom，这里是span，这应该是antd Tooltip的机制问题 */}
        <span><Avatar value={avatarValue} size="small" type="bottts" /></span>
      </Tooltip>
    );
    return (
      <div className="redux-nav-item">
        <Button type="primary" onClick={this.showModal}>
          {t('新建团队')}
        </Button>
        <List
          rowKey="id"
          className="filter-card-list"
          grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
          dataSource={data}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  (item.admin === userInfo.username || item.memberInvite) ? <Tooltip title="invite" onClick={() => this.openInvite(item._id)}>
                    <Icon type="share-alt" />
                  </Tooltip> : <Icon type="smile" />
                ]}
              >
                <Card.Meta avatar={<Avatar value={item.avatar} />} title={item.teamName} description={item.dsc} />
                <div className="card-item-content">
                  <div className="card-info">
                    {
                      namedAvatar(`admin: ${item.admin}`, item.admin)
                    }
                    {
                      item.members.map(i => namedAvatar(i, i))
                    }
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Modal
          width={800}
          visible={inviteVisible}
          title={t('邀请用户')}
          onOk={this.handleInviteOk}
          onCancel={this.handleInviteCancel}
          footer={[
            <Button key="back" onClick={this.handleInviteCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={inviteLoading}
              onClick={this.handleInviteOk}
            >
              Submit
            </Button>
          ]}
        >
          <InviteModal ref="inviteModal" />
        </Modal>
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

const mapStateToProps = state => ({
  data: state.teamData || [],
  userInfo: state.userInfo || {}
});

export default connect(mapStateToProps, { createTeam, findTeam, invite })(withTranslation('translation', { withRef: true })(Teams));
