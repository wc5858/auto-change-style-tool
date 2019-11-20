import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTask } from '../store/actions';
import { Row, Modal, Button, Table } from 'antd';
import CreateTask from '../subComponents/createTask';

class Home extends Component {
  state = {
    loading: false,
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    const { createTask } = this.props;
    this.setState({ loading: true });
    this.refs.taskForm.validateFields((err, values) => {
      if (!err) {
        const { url, site, colorDataId } = values;
        const data = {
          url,
          site,
          colorDataId
        };
        createTask(data);
        this.setState({
          loading: false,
          visible: false
        });
        // this.refs.taskForm.resetFields();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <div className="redux-nav-item">
        <div>
          <Button type="primary" onClick={this.showModal}>
            新建风格更换任务
          </Button>
        </div>
        <Modal
          width={800}
          visible={visible}
          title="创建任务"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <CreateTask ref="taskForm" />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  list: state.list
});

export default connect(mapStateToProps, { createTask })(Home);
