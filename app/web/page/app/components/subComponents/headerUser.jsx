import React, { Component, Fragment } from 'react';
import { Badge, Icon, Modal, Button  } from 'antd';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import InvitationList from './invitationList';
import Avatar from './avatar';

class HeaderUser extends Component {
  state = {
    visible: false
  };

  handleDone = () => {
    this.setState({
      visible: false
    });
  };

  openInvitation = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    const { userInfo } = this.props;
    const { visible } = this.state;
    return (
      <Fragment>
        <span style={{
          margin: '0 20px',
          cursor: 'pointer'
        }} onClick={this.openInvitation}>
          <Badge count={userInfo.invitation.length} dot>
            <Icon type="mail" />
          </Badge>
        </span>
        <Avatar value={userInfo.username} size="small" type="bottts" />
        <span style={{
          margin: '0 10px'
        }}>
          {userInfo.username}
        </span>
        <Modal
          width={800}
          visible={visible}
          title="handle invitation"
          onOk={this.handleDone}
          onCancel={this.handleDone}
          footer={[
            <Button
              key="done"
              type="primary"
              onClick={this.handleDone}
            >
              Done
            </Button>
          ]}
        >
          <InvitationList />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(withTranslation('translation', { withRef: true })(HeaderUser));
