import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';

let id = 1;

class AddComponent extends Component {
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

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({
      names: []
    });
    id = 1;
  }

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
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
        label={index === 0 ? '子页面url' : ''}
        required={true}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入子页面url或删除此项'
            }
          ]
        })(
          <Input
            placeholder="子页面url"
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
        <Form.Item label="基础url">
          {getFieldDecorator('baseUrl', {
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
        <Form.Item label="分片粒度">
          {getFieldDecorator('pac', {
            initialValue: 5,
            rules: [
              {
                required: true,
                validator: (rule, value) => value >=0 && value <=10,
                message: '请输入0到10的数字!'
              }
            ]
          })(<Input placeholder="0到10之间，越大代表粒度越粗" />)}
        </Form.Item>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加子页面
          </Button>
        </Form.Item>
        <Form.Item label="批量添加">
          {getFieldDecorator('subUrls')(
            <Input.TextArea placeholder="输入多个子页面，以逗号分隔，并点击下方按钮完成批量添加" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            onClick={this.addMore}
            style={{ width: '60%' }}
            type="primary"
          >
            <Icon type="plus" /> 批量添加子页面
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedAddComponent = Form.create({ name: 'add_Component' })(
  AddComponent
);
export default WrappedAddComponent;
