import React, { Component } from 'react';
import { Avatar } from 'antd';
import Avatars from '@dicebear/avatars';
import GridySpriteCollection from '@dicebear/avatars-gridy-sprites';
import BotttsSpriteCollection from '@dicebear/avatars-bottts-sprites';

const gridyAvatars = new Avatars(GridySpriteCollection);
const botttsAvatars = new Avatars(BotttsSpriteCollection);

class SvgAvatar extends Component {
  render() {
    const { value = '', type, size } = this.props;
    const avatars = type === 'bottts' ? botttsAvatars : gridyAvatars;
    // 调用toString，因为数据类型会影响avatar结果
    const svg = avatars.create(value.toString());
    return (
      <Avatar size={size || 'large'} style={{ background: `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')` }} />
    );
  }
}

export default SvgAvatar;