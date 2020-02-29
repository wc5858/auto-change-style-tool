import React, { Component } from 'react';

import { Button, Avatar } from 'antd';
import Avatars from '@dicebear/avatars';
import SpriteCollection from '@dicebear/avatars-gridy-sprites';
import { withTranslation } from 'react-i18next';

const avatars = new Avatars(SpriteCollection);

class ChangeableAvatar extends Component {
  handleChange = () => {
    const value = Math.random();
    this.props.onChange(value);
  };

  render() {
    const { value } = this.props;
    const svg = avatars.create(value);
    return (
      <div>
        <Avatar size="large" style={{ background: `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')` }} />
        <Button size="small" style={{ marginLeft: 16, verticalAlign: 'middle' }} onClick={this.handleChange}>change</Button>
      </div>
    );
  }
}

export default ChangeableAvatar;