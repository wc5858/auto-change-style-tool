import React, { Component } from 'react';
import { Form, Input, Select, Divider, Icon, Tooltip, Checkbox, Avatar } from 'antd';
import { withTranslation } from 'react-i18next';
import ChangeableAvatar from './changeableAvatar';
class CreateTeam extends Component {
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
        <Form.Item {...formItemLayoutWithOutLabel}>
          {getFieldDecorator('avatar', {
            initialValue: 1
          })(<ChangeableAvatar />)}
        </Form.Item>
        <Form.Item label={t('团队名称')}>
          {getFieldDecorator('teamName', {
            rules: [
              {
                required: true,
                message: t('请输入团队名称!')
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={t('团队描述')}>
          {getFieldDecorator('dsc', {
            rules: [
              {
                required: true,
                message: t('请输入团队描述!')
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          {getFieldDecorator('memberInvite', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>{t('成员可邀请其他人加入')}</Checkbox>)}
        </Form.Item>
      </Form >
    );
  }
}

// 三层HOC...
const WrappedCreateTeam = Form.create({ name: 'create_team' })(
  withTranslation('translation', { withRef: true })(CreateTeam)
);
export default WrappedCreateTeam;
