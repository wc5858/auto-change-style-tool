import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import cssbeautify from 'cssbeautify';
import hljs from 'highlight.js/lib/highlight';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('css', css);

class HtmlModal extends Component {
  render() {
    const { visible, onCancel, code } = this.props;
    console.log(cssbeautify(code))
    console.log(hljs.highlight('css', cssbeautify(code)).value)
    return (
      <Modal
        title="css代码"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
        width={'80%'}
      >
        <pre style={{height: '70vh'}} dangerouslySetInnerHTML={{ __html: hljs.highlight('css', cssbeautify(code)).value }} />
      </Modal>
    );
  }
}

export default HtmlModal;
