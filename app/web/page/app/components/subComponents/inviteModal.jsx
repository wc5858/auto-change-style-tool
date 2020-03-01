import React, { Component } from 'react';
import { Form, Input, Select, Divider, Icon, Tooltip, Checkbox, Avatar } from 'antd';
import { withTranslation } from 'react-i18next';
import ChangeableAvatar from './changeableAvatar';
class InviteModal extends Component {
  render() {
    const { form, t } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label={t('用户名')}>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: t('请输入用户名!')
              }
            ]
          })(<Input />)}
        </Form.Item>
      </Form >
    );
  }
}

const WrappedInviteModal = Form.create({ name: 'invite' })(
  withTranslation('translation', { withRef: true })(InviteModal)
);
export default WrappedInviteModal;
