import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Form, Input, Button, Icon, Checkbox, message } from 'antd';
import UserLayout from '../../component/userLayout';
import './login.less';

axios.defaults.headers['x-csrf-token'] = Cookies.get('csrfToken');

class LoginPage extends Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submitting: true
        });
        axios.post('/api/v1/user/login', values).then(res => {
          if (res.data.success) {
            message.success('Login success');
            location.href = '/';
          } else {
            message.error(`Login failed: ${res.data.error}`);
          }
        });
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { url } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <UserLayout hideHeader><div className="login-main">
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/register">register now!</a>
        </Form.Item>
      </Form>
    </div></UserLayout>;
  }
}
export default Form.create({
  mapPropsToFields(props) {
    return {
      login: props.login
    }
  }
})(LoginPage);