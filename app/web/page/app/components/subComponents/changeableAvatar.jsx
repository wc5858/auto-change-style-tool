import React, { Component } from 'react';
import { Button } from 'antd';
import Avatar from './avatar';

class ChangeableAvatar extends Component {
  handleChange = () => {
    const value = Math.random();
    this.props.onChange(value);
  };

  render() {
    const { value } = this.props;
    return (
      <div>
        <Avatar value={value} />
        <Button size="small" style={{ marginLeft: 16, verticalAlign: 'middle' }} onClick={this.handleChange}>change</Button>
      </div>
    );
  }
}

export default ChangeableAvatar;