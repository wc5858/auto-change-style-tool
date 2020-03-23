import React, { Component } from 'react';
import { Row, Modal, Button, Table } from 'antd';
import { connect } from 'react-redux';
import {
  createCatcher,
  findCatcher,
  deleteCatcher
} from '../store/actions';
import AddCatcher from '../subComponents/addCatcher';
import { withTranslation } from 'react-i18next';
class Catcher extends Component {
  state = {
    loading: false,
    visible: false,
    htmlTestModalVisible: false,
    html: ''
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  showHtmlModal = ({ bodyHTML}) => {
    this.setState({
      htmlTestModalVisible: true,
      html: `<style>${style}</style>${bodyHTML}`
    });
  };

  htmlModalOk = () => {
    this.setState({
      htmlTestModalVisible: false
    });
  };

  htmlModalCancel = () => {
    this.setState({
      htmlTestModalVisible: false
    });
  };

  handleOk = () => {
    const { createCatcher } = this.props;
    this.setState({ loading: true });
    this.refs.CatcherForm.validateFields((err, values) => {
      if (!err) {
        if(values.taskDataId){
          createCatcher(values);
          this.setState({
            loading: false,
            visible: false
          });
          this.refs.CatcherForm.resetFields();
        } else {
          message.error('Missing data source');
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading, htmlTestModalVisible, html} = this.state;
    const { data, findCatcher, deleteCatcher, teamData, t } = this.props;
    const columns = [
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        render: state => t(state)
      },
      {
        title: 'TaskDataName',
        dataIndex: 'taskDataName',
        key: 'taskDataName'
      },
      {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        // 这里要防御列表数据先取到，teamData后取到的情况
        render: teamId => (teamData.find(i => i._id === teamId) || {}).teamName || 'private'
      },
      {
        title: 'Creator',
        dataIndex: 'creator',
        key: 'creator'
      },
      {
        title: 'ShowResult',
        key: 'action_show',
        render: record => (
          <span>
            {!!record.result && (
              <a onClick={() => this.showHtmlModal(record.result)}>
                {t('点击查看网页')}
              </a>
            )}
          </span>
        )
      },
      {
        title: 'Delete',
        key: 'action_delete',
        render: record => (
          <span>
            <a onClick={() => deleteCatcher(record._id)}>Delete</a>
          </span>
        )
      }
    ];

    return (
      <div className="redux-nav-item">
        <div>
          <Button type="primary" onClick={this.showModal}>
            {t('新建事件数据')}
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findCatcher}
          >
            {t('刷新数据')}
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title={t('新建测试数据')}
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
          <AddCatcher
            wrappedComponentRef={inst => (this.formRef = inst)}
            ref="CatcherForm"
          />
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  data: state.catcherData || [],
  teamData: state.teamData || []
});

export default connect(mapStateToProps, {
  createCatcher,
  findCatcher,
  deleteCatcher
})(withTranslation('translation', { withRef: true })(Catcher));
