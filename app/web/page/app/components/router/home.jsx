import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTask, findTask } from '../store/actions';
import { Row, Modal, Button, Table, Steps } from 'antd';
import CreateTask from '../subComponents/createTask';
import HtmlModal from '../subComponents/htmlModal';

const { Step } = Steps;

class Home extends Component {
  state = {
    loading: false,
    visible: false,
    htmlModalVisible: false,
    html: '',
    style: ''
  };

  onExpand = () => {
    this.setState({ current: 0 });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  showHtmlModal = ({ bodyHTML, style = '' }) => {
    this.setState({
      htmlModalVisible: true,
      html: `<style>${style}</style>${bodyHTML}`,
      style
    });
  };

  htmlModalOk = () => {
    this.setState({
      htmlModalVisible: false
    });
  };

  htmlModalCancel = () => {
    this.setState({
      htmlModalVisible: false
    });
  };

  handleOk = () => {
    const { createTask } = this.props;
    this.setState({ loading: true });
    this.refs.taskForm.validateFields((err, values) => {
      if (!err) {
        createTask(values);
        this.setState({
          loading: false,
          visible: false
        });
        this.refs.taskForm.resetFields();
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading, htmlModalVisible, html, style } = this.state;
    const { data, findTask } = this.props;
    const columns = [
      {
        title: 'Site',
        dataIndex: 'site',
        key: 'site'
      },
      {
        title: 'url',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
      },
      {
        title: 'ColorDataName',
        dataIndex: 'colorDataName',
        key: 'colorDataName'
      },
      {
        title: 'ComponentDataNames',
        dataIndex: 'componentDataNames',
        key: 'componentDataNames',
        render: record => (record || []).join(',')
      },

      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            {!!record.result && (
              <a onClick={() => this.showHtmlModal(record.result)}>
                点击查看网页
              </a>
            )}
          </span>
        )
      }
    ];
    const extraInfo = (data, name) =>
      data && (
        <div>
          <p style={{ margin: 0 }}>
            <label style={{ fontWeight: 700 }}>{name}:</label>
          </p>
          <p style={{ margin: 0 }}>{JSON.stringify(data, null, 4)}</p>
        </div>
      );
    return (
      <div className="redux-nav-item">
        <div>
          <Button type="primary" onClick={this.showModal}>
            新建风格更换任务
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findTask}
          >
            刷新数据
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            onExpand={this.onExpand}
            expandedRowRender={record => (
              <div>
                {extraInfo(record.settings, 'Settings')}
                {extraInfo(record.err, 'Error')}
                {!!record.taskList && (
                  <Steps
                    type="navigation"
                    size="small"
                    current={record.taskList.length - 1}
                    style={{
                      marginBottom: 60,
                      boxShadow: '0px -1px 0 0 #e8e8e8 inset'
                    }}
                  >
                    {record.taskList.map(item => (
                      <Step
                        title={item.name}
                        subTitle={
                          item.wait ? '执行中...' : item.time / 1000 + 's'
                        }
                        status={
                          item.wait ? 'wait' : item.success ? 'finish' : 'error'
                        }
                        description={
                          <div>
                            {!!item.screenshot && (
                              <img src={item.screenshot} width="120" />
                            )}
                            {!!item.error && JSON.stringify(item.error)}
                          </div>
                        }
                      />
                    ))}
                  </Steps>
                )}
              </div>
            )}
            dataSource={data}
          />
        </Row>
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
        <HtmlModal
          visible={htmlModalVisible}
          onOk={this.htmlModalOk}
          onCancel={this.htmlModalCancel}
          html={html}
          css={style}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.taskData || []
});

export default connect(mapStateToProps, { createTask, findTask })(Home);
