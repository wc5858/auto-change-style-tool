import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Form, Input, Button, Icon, Checkbox, Alert, Result, message } from 'antd';
import UserLayout from '../../component/userLayout';
import './register.less';

axios.defaults.headers['x-csrf-token'] = Cookies.get('csrfToken');

class RegisterPage extends Component {

  state = {
    submitting: false,
    alert: false,
    content: '',
    success: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password !== values.repeatPassword) {
          this.setState({
            alert: true,
            content: 'The passwords entered are different'
          });
        } else {
          this.setState({
            alert: false,
            submitting: true
          });
          axios.post('/api/v1/user/register', {
            data: values
          }).then(res => {
            if (res.data.success) {
              this.setState({
                alert: false,
                submitting: false,
                success: true
              });
            } else {
              message.error(`registration failed: ${res.data.error}`);
            }
          });
        }
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { alert, content, submitting, success } = this.state;
    return <UserLayout hideHeader><div className="register-main">
      {!success && <Form onSubmit={this.handleSubmit} className="register-form">
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
          {getFieldDecorator('repeatPassword', {
            rules: [{ required: true, message: 'Please repeat your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Repeat Password"
            />
          )}
        </Form.Item>
        {
          alert && this.renderMessage(content)
        }
        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-form-button">
            Register
          </Button>
          Or <a href="/login">login directly!</a>
        </Form.Item>
      </Form>}
      {success && <Result
        status="success"
        title="Register success"
        extra={[
          <Button type="primary" key="goLogin" onClick={() => location.href = '/login'}>
            Go Login
          </Button>
        ]}
      />}
    </div></UserLayout>;
  }
}
export default Form.create()(RegisterPage);