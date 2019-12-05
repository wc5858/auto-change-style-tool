import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class HtmlModal extends Component {
  render() {
    const { visible, onOk, onCancel, html } = this.props;
    return (
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={'80%'}
      >
        <div style={{ maxWidth: '1800px', overflowX: 'scroll' }}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </Modal>
    );
  }
}

export default HtmlModal;
