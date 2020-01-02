import React, { Component } from 'react';
import { Modal, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { getNanoCss } from '../store/actions';
import CodeModal from './codeModal';

const getCss = element => {
  return [...element.querySelectorAll('*')]
    .map(i => i.getAttribute('data-used-css') || '')
    .filter(i => i !== 'null')
    .join('');
};

class HtmlModal extends Component {
  state = {
    visible: false,
    visible2: false
  };

  showModal = async ele => {
    const { getNanoCss, css } = this.props;
    await getNanoCss(ele ? getCss(ele) : css);
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, onOk, onCancel, html } = this.props;
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
          <Button onClick={() => this.showModal()}>
            查看页面CSS（不含替换组件部分，仅供参考）
          </Button>
          <Divider />
          <div
            style={{ maxWidth: '1800px', overflow: 'scroll', height: '70vh' }}
          >
            <div
              className="html-container"
              dangerouslySetInnerHTML={{ __html: html }}
              onClick={async e => {
                if (e.target.getAttribute('data-replaced')) {
                  await this.showModal(e.target);
                }
              }}
            />
          </div>
        </Modal>
        <CodeModal visible={codeModalVisible} onCancel={this.handleCancel} />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { getNanoCss })(HtmlModal);
