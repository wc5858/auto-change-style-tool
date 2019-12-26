import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import cssbeautify from 'cssbeautify';
import hljs from 'highlight.js/lib/highlight';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('css', css);

class CodeModal extends Component {
  render() {
    const { visible, onCancel, code, cssData } = this.props;
    return (
      <Modal
        title="css代码"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
        width={'80%'}
      >
        <pre style={{height: '70vh'}} dangerouslySetInnerHTML={{ __html: hljs.highlight('css', cssbeautify(code || cssData)).value }} />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ cssData: state.cssData || '' });

export default connect(mapStateToProps, { })(CodeModal);
