import React from 'react';
import { Row, Modal, Button, Table } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  createComponent,
  findComponent,
  deleteComponent
} from '../store/actions';
import AddComponent from '../subComponents/addComponent';
import { withTranslation } from 'react-i18next';

const mergeCss = css => {
  let cssString = '';
  for (const i in css) {
    if (css.hasOwnProperty(i)) {
      cssString += `${i}:${css[i]};`;
    }
  }
  return cssString;
};

const rebuildHTML = (treeNode, isReplaced) => {
  if (!treeNode) {
    return '';
  }
  if (typeof treeNode == 'string') {
    return treeNode;
  }
  if (!treeNode.info) {
    return '';
  }
  let innerHTML = treeNode.children
    ? treeNode.children.reduce((pre, cur) => pre + rebuildHTML(cur, treeNode.isReplaced), '')
    : treeNode.content
      ? treeNode.content
      : '';
  const tag = treeNode.info.tag;
  // const style = treeNode.isReplaced || isReplaced ? mergeCss(treeNode.info.css) : treeNode.info.style;
  const style = mergeCss(treeNode.info.css);
  return `<${tag} class="${treeNode.info.class.join(' ')}" parent="${treeNode.info.pre}" ${
    tag == 'IMG' ? `src="${treeNode.info.src}"` : ''
  } ${treeNode.id ? `data-id="${treeNode.id}"` : ''} ${
    treeNode.isReplaced ? 'data-replaced="1"' : ''
  } style='${style}' data-used-css='${treeNode.info.usedCss}' ${treeNode.info.id ? `id=${treeNode.info.id}` : ''}>${innerHTML}</${tag}>`;
};

const listComponent = dataList => {
  return dataList ? <div>{dataList.map(i => {
    const html = rebuildHTML(i.node);
    return <div style={{
      padding: 20,
      borderBottom: '1px solid gray'
    }} dangerouslySetInnerHTML={{__html: html}}></div>
  })}</div> : null;
}

class Component extends React.Component {
  state = {
    loading: false,
    visible: false,
    data: {}
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  getData = async record => {
    // 赶时间，偷懒了
    const res = await axios({
      method: 'post',
      url: '/api/v1/component/data',
      data: {
        filename: record.filename
      }
    });
    const data = this.state.data;
    if (res.data.success) {
      data[record._id] = JSON.parse(res.data.data);
      this.setState({
        data
      });
    }
  }

  handleOk = () => {
    const { createComponent } = this.props;
    this.setState({ loading: true });
    this.refs.ComponentForm.validateFields((err, values) => {
      if (!err) {
        const { baseUrl, site, names, pac, teamId, share } = values;
        const data = {
          baseUrl,
          site,
          subPages: names.filter(i => i),
          pac,
          team: share ? teamId : null
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
    const { data, findComponent, deleteComponent, teamData, t } = this.props;
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
            {t('新建组件数据')}
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findComponent}
          >
            {t('刷新数据')}
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
                <Button onClick={() => this.getData(record)}>load data</Button>
                {
                  listComponent(this.state.data[record._id])
                }
              </div>
            )}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title={t('新建组件数据')}
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
  data: state.componentData || [],
  teamData: state.teamData || []
});

export default connect(mapStateToProps, {
  createComponent,
  findComponent,
  deleteComponent
})(withTranslation('translation', { withRef: true })(Component));
