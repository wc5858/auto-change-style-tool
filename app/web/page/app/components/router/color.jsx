import React, { Component } from 'react';
import { Row, Modal, Button, Table } from 'antd';
import { connect } from 'react-redux';
import {  createColor, findColor, deleteColor } from '../store/actions';
import AddColor from '../subComponents/addColor';

class Color extends Component {
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
    const { createColor } = this.props;
    this.setState({ loading: true });
    this.refs.colorForm.validateFields((err, values) => {
      if (!err) {
        const { baseUrl, site, names } = values;
        const data = {
          baseUrl,
          site,
          subPages: names.filter(i => i)
        };
        createColor(data);
        this.setState({
          loading: false,
          visible: false
        });
        this.refs.colorForm.resetFields();
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
    const { data, findColor, deleteColor } = this.props;
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
        title: 'Action',
        key: 'action',
        render: (record) => (
          <span>
            <a onClick={ () => deleteColor(record._id) }>Delete</a>
          </span>
        )
      }
    ];

    const extraInfo = (data, name) => (data && (
      <div>
        <p style={{ margin: 0 }}><label style={{ fontWeight: 700 }}>{name}:</label></p>
        <p style={{ margin: 0 }}>{JSON.stringify(data, null, 4)}</p>
      </div>
    ))

    return (
      <div className="redux-nav-item">
        <div>
          <Button type="primary" onClick={this.showModal}>
            新建色彩数据
          </Button>
          <Button type="primary" icon="redo" style={{ marginLeft: '10px' }} onClick={findColor}>
            刷新数据
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            expandedRowRender={record => <div>
              <p style={{ margin: 0 }}><label style={{ fontWeight: 700 }}>SubPages:</label></p>
              <p style={{ margin: 0 }}>{record.subPages.join(',')}</p>
              {
                extraInfo(record.bgColor, 'BgColorData')
              }
              {
                extraInfo(record.fontColor, 'FontColorData')
              }
              {
                extraInfo(record.err, 'Error')
              }
            </div>}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title="创建颜色数据"
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
          <AddColor ref="colorForm" />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.colorData || []
});

export default connect(
  mapStateToProps,
  { createColor, findColor, deleteColor }
)(Color);
