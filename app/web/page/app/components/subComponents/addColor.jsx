import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Icon, Button, Checkbox, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

let id = 1;

class AddColor extends Component {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  addMore = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const names = form.getFieldValue('names');
    const subUrls = (form.getFieldValue('subUrls') || '').split(',');
    const newKeys = subUrls.map(() => id++);
    form.setFieldsValue({
      keys: keys.concat(newKeys)
    });
    // 因为antD的表单设计的缺陷，只能通过这种方式插入数据
    setTimeout(() => {
      form.setFieldsValue({
        names: names.concat(subUrls)
      });
    }, 0);
  };

  render() {
    const { form, t, teamData } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
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
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? t('子页面url') : ''}
        required={true}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: t('请输入子页面url或删除此项')
            }
          ]
        })(
          <Input
            placeholder={t('子页面url')}
            style={{ width: '60%', marginRight: 8 }}
          />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Form {...formItemLayout}>
        <Form.Item label={t('站点名称')}>
          {getFieldDecorator('site', {
            rules: [
              {
                type: 'string',
                message: t('请输入正确的站点名称!')
              },
              {
                required: true,
                message: t('请输入站点名称!')
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label={t('基础url')}>
          {getFieldDecorator('baseUrl', {
            rules: [
              {
                type: 'url',
                message: t('请输入正确的url!')
              },
              {
                required: true,
                message: t('请输入url!')
              }
            ]
          })(<Input />)}
        </Form.Item>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> {t('添加子页面')}
          </Button>
        </Form.Item>
        <Form.Item label={t('批量添加')}>
          {getFieldDecorator('subUrls')(
            <Input.TextArea placeholder={t('输入多个子页面，以逗号分隔，并点击下方按钮完成批量添加')} />
          )}
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            onClick={this.addMore}
            style={{ width: '60%' }}
            type="primary"
          >
            <Icon type="plus" /> {t('批量添加子页面')}
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          {getFieldDecorator('share', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>{t('分享到团队')}</Checkbox>)}
        </Form.Item>
        {

          form.getFieldValue('share') &&
          (
            teamData.length > 0 ?
              <Form.Item label={t('团队')}>
                {getFieldDecorator('teamId', {
                  initialValue: teamData[0]._id
                })(
                  <Select>
                    {teamData
                      .map(({ _id, teamName }) => (
                        <Select.Option value={_id} key={_id}>
                          {teamName}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item> :
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Link to="/teams">{t('没有团队，去创建')}</Link>
              </Form.Item>
          )
        }
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  teamData: state.teamData || [],
  userInfo: state.userInfo || {}
});

const WrappedAddColor = Form.create({ name: 'add_color' })(
  connect(mapStateToProps, {})(withTranslation('translation', { withRef: true })(AddColor))
);
export default WrappedAddColor;
