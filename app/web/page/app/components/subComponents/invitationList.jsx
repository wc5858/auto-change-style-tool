import React, { Component } from 'react';
import { List } from 'antd';
import Avatar from './avatar';
import { connect } from 'react-redux';
import { decline, join } from '../store/actions';
import { withTranslation } from 'react-i18next';

class InvitationList extends Component {
  render() {
    const { userInfo, decline, join } = this.props;
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={userInfo.invitation}
        renderItem={item => (
          <List.Item
            actions={[
              <a key="list-accept" onClick={() => join({
                teamId: item.teamId._id
              })}>accept</a>,
              <a key="list-decline" onClick={() => decline({
                teamId: item.teamId._id
              })}>decline</a>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar value={item.invitor} size="small" type="bottts" />
              }
              title={item.invitor}
              description={`${item.invitor} invite you to join team ${item.teamId.teamName}`}
            />
          </List.Item>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps, { decline, join })(withTranslation('translation', { withRef: true })(InvitationList));
