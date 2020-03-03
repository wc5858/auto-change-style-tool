import React, { Component } from 'react';
import { Row, Modal, Button, Table, Collapse } from 'antd';
import { connect } from 'react-redux';
import { createColor, findColor, deleteColor } from '../store/actions';
import AddColor from '../subComponents/addColor';
import ShowColors from '../subComponents/showColors';
import { withTranslation } from 'react-i18next';

const { Panel } = Collapse;

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
        const { baseUrl, site, names, teamId, share } = values;
        const data = {
          baseUrl,
          site,
          subPages: names.filter(i => i),
          team: share ? teamId : null
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
    const { data, findColor, deleteColor, teamData, t } = this.props;
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
        key: 'state',
        render: state => t(state)
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: time => time && Math.round(time / 1000) + t('秒')
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
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            <a onClick={() => deleteColor(record._id)}>Delete</a>
          </span>
        )
      }
    ];

    const extraInfo = (data, name) =>
      data && (
        <Panel header={name} key={name}>
          <p>{JSON.stringify(data, null, 4)}</p>
        </Panel>
      );

    const showColor = (data, key, name) =>
      data && (
        <Panel header={name} key={name}>
          <ShowColors
            colorData={Object.entries(data).map(([color, info]) => ({
              name: color,
              value: info[key]
            }))}
          />
        </Panel>
      );
    return (
      <div className="redux-nav-item">
        <div>
          <Button type="primary" onClick={this.showModal}>
            {t('新建色彩数据')}
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findColor}
          >
            {t('刷新数据')}
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            expandedRowRender={record => (
              <Collapse defaultActiveKey={['SubPages']}>
                <Panel header="SubPages" key="SubPages">
                  <p>{record.subPages.join(',')}</p>
                </Panel>
                {extraInfo(record.bgColor, `BgColorData(${t('原始数据')})`)}
                {showColor(record.bgColor, 'areaRatio', t('背景色按面积分布情况'))}
                {showColor(
                  record.bgColor,
                  'timesRatio',
                  t('背景色按出现频率分布情况')
                )}
                {extraInfo(record.fontColor, `FontColorData(${t('原始数据')})`)}
                {showColor(
                  record.fontColor,
                  'lengthRatio',
                  t('字体颜色按字符数分布情况')
                )}
                {extraInfo(record.err, 'Error')}
              </Collapse>
            )}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title={t('新建色彩数据')}
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
  data: state.colorData || [],
  teamData: state.teamData || []
});

export default connect(mapStateToProps, {
  createColor,
  findColor,
  deleteColor
})(withTranslation('translation', { withRef: true })(Color));
