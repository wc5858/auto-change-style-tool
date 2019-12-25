import React, { Component } from 'react';
import { Modal, Button, Divider } from 'antd';
import CodeModal from './codeModal';

class HtmlModal extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  
  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, onOk, onCancel, html, cleanCss } = this.props;
    const { visible: codeModalVisible } = this.state;
    return (
      <div>
        <Modal
          title="页面内容"
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          width={'80%'}
        >
          <Button onClick={this.showModal} >查看页面CSS（不含替换组件部分）</Button>
          <Divider />
          <div style={{ maxWidth: '1800px', overflow: 'scroll', height: '70vh' }}>
            <div
              className="html-container"
              dangerouslySetInnerHTML={{ __html: html }}
              onClick={e => {
                if (e.target.getAttribute('data-replaced')) {
                  console.log(e.target);
                }
              }}
            />
          </div>
        </Modal>
        <CodeModal visible={codeModalVisible} code={cleanCss} onCancel={this.handleCancel}/>
      </div>
    );
  }
}

export default HtmlModal;
