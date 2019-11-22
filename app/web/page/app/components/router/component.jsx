import React from 'react';
import { Row, Modal, Button, Table } from 'antd';
import { connect } from 'react-redux';
import {
  createComponent,
  findComponent,
  deleteComponent
} from '../store/actions';
import AddComponent from '../subComponents/addComponent';

class Component extends React.Component {
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
    const { createComponent } = this.props;
    this.setState({ loading: true });
    this.refs.ComponentForm.validateFields((err, values) => {
      if (!err) {
        const { baseUrl, site, names, pac } = values;
        const data = {
          baseUrl,
          site,
          subPages: names.filter(i => i),
          pac
        };
        createComponent(data);
        this.setState({
          loading: false,
          visible: false
        });
        this.formRef.reset();
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
    const { data, findComponent, deleteComponent } = this.props;
    const columns = [
      {
        title: 'Site',
        dataIndex: 'site',
        key: 'site'
      },
      {
        title: 'BaseUrl',
        dataIndex: 'baseUrl',
        key: 'baseUrl'
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: time => time && Math.round(time / 1000) + '秒'
      },
      {
        title: 'Pac',
        dataIndex: 'pac',
        key: 'pac'
      },
      {
        title: 'Filename',
        dataIndex: 'filename',
        key: 'filename'
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            <a onClick={() => deleteComponent(record._id)}>Delete</a>
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
            创建组件数据
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findComponent}
          >
            刷新数据
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            expandedRowRender={record => (
              <div>
                <p style={{ margin: 0 }}>
                  <label style={{ fontWeight: 700 }}>SubPages:</label>
                </p>
                <p style={{ margin: 0 }}>{record.subPages.join(',')}</p>
                {extraInfo(record.err, 'Error')}
              </div>
            )}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title="创建组件数据"
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
          <AddComponent
            wrappedComponentRef={inst => (this.formRef = inst)}
            ref="ComponentForm"
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.componentData || []
});

export default connect(mapStateToProps, {
  createComponent,
  findComponent,
  deleteComponent
})(Component);
