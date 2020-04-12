import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Divider, Icon, Tooltip, Checkbox, Button, Col, Row } from 'antd';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

let id = 0;

class CreateTask extends Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // const nextKeys = keys.concat({
    //   id: keys.length,
    //   pac: 3,
    //   threshold1: 1,
    //   threshold2: 0.3
    // });
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };
  render() {
    const { form, colorData, componentData, teamData, t } = this.props;
    const filteredComponentData = componentData.filter(item => !item.err && item.state === '执行成功');
    const filteredColorData = colorData.filter(item => !item.err && item.state === '执行成功');
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const settingItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      style: {
        marginBottom: 0
      }
    };
    const settingItems = keys.map((k, index) => (
      <Row key={k} type="flex" align="middle">
        <Col span={4} style={{ textAlign: 'right' }}>参数组合{k + 1}:</Col>
        <Col span={6}>
          <Form.Item label={t('分片粒度')} {...settingItemLayout}>
            {getFieldDecorator(`settings[${k}].pac`, {
              initialValue: 3,
              rules: [
                {
                  required: true,
                  validator: (rule, value) => value >= 0 && value <= 10,
                  message: t('请输入0到10的数字!')
                }
              ]
            })(<Input placeholder={t('0到10之间，越大代表粒度越粗')} />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item {...settingItemLayout}
            label={
              <span>
                {t('停止阈值')}&nbsp;
                <Tooltip title={t('相似度达到此值时不继续匹配，设置为1则总是不停止')}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator(`settings[${k}].threshold1`, {
              initialValue: 1
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item {...settingItemLayout}
            label={
              <span>
                {t('下限阈值')}&nbsp;
                <Tooltip title={t('相似度未达到此值时不发生匹配，设置为0则总是发生替换')}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator(`settings[${k}].threshold2`, {
              initialValue: 0.3
            })(<Input />)}
          </Form.Item>
        </Col>
        {keys.length > 1 ? (
          <Col span={2}>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
              style={{
                marginLeft: 10
              }}
            />
          </Col>
        ) : null}
      </Row>
    ));
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
        <Form.Item label={t('站点url')}>
          {getFieldDecorator('url', {
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
        <Divider>{t('更换组件')}</Divider>
        {
          filteredComponentData.length > 0 ?
            <Form.Item label={t('组件数据源')}>
              {getFieldDecorator('componentDataId', {
                initialValue: [filteredComponentData[0]._id]
              })(
                <Select mode="multiple">
                  {filteredComponentData
                    .filter(item => !item.err)
                    .map(({ _id, site }) => (
                      <Option value={_id} key={_id}>
                        {site}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item> :
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Link to="/component">{t('没有可用的组件数据，去创建')}</Link>
            </Form.Item>
        }
        {settingItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
            <Icon type="plus" /> 添加参数组合
          </Button>
        </Form.Item>
        <Divider>{t('更换颜色')}</Divider>
        {
          filteredColorData.length > 0 ?
            <Form.Item label={t('颜色数据源')}>
              {getFieldDecorator('colorDataId', {
                initialValue: filteredColorData[0]._id
              })(
                <Select>
                  {filteredColorData
                    .map(({ _id, site }) => (
                      <Option value={_id} key={_id}>
                        {site}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item> :
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Link to="/color">{t('没有可用的颜色数据，去创建')}</Link>
            </Form.Item>
        }
        <Form.Item label={t('背景色替换规则')}>
          {getFieldDecorator('bgMappingType', {
            initialValue: 'area'
          })(
            <Select>
              {['area', 'times'].map(item => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
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

// 三层HOC...
const WrappedCreateTask = Form.create({ name: 'create_task' })(
  connect(state => ({
    colorData: state.colorData,
    componentData: state.componentData,
    teamData: state.teamData || [],
    userInfo: state.userInfo || {}
  }))(withTranslation('translation', { withRef: true })(CreateTask))
);
export default WrappedCreateTask;
