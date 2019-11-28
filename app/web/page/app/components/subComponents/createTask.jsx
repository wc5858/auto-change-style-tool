import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Divider } from 'antd';

class CreateTask extends Component {
  render() {
    const { form, colorData, componentData } = this.props;
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
    return (
      <Form {...formItemLayout}>
        <Form.Item label="站点名称">
          {getFieldDecorator('site', {
            rules: [
              {
                type: 'string',
                message: '请输入正确的站点名称!'
              },
              {
                required: true,
                message: '请输入站点名称!'
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="站点url">
          {getFieldDecorator('url', {
            rules: [
              {
                type: 'url',
                message: '请输入正确的url!'
              },
              {
                required: true,
                message: '请输入url!'
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="组件数据源">
          {getFieldDecorator('componentDataId', {
            initialValue: componentData[0]._id
          })(
            <Select>
              {componentData
                .filter(item => !item.err)
                .map(({ _id, site }) => (
                  <Option value={_id} key={_id}>
                    {site}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>
        <Divider>更换颜色</Divider>
        <Form.Item label="">
          {getFieldDecorator('colorDataId', {
            initialValue: colorData[0]._id
          })(
            <Select>
              {colorData
                .filter(item => !item.err)
                .map(({ _id, site }) => (
                  <Option value={_id} key={_id}>
                    {site}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="背景色替换规则">
          {getFieldDecorator('bgMappingType', {
            initialValue: 'area'
          })(
            <Select>
              {['area', 'times']
                .map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedCreateTask = Form.create({ name: 'create_task' })(
  connect(state => ({
    colorData: state.colorData,
    componentData: state.componentData
  }))(CreateTask)
);
export default WrappedCreateTask;
