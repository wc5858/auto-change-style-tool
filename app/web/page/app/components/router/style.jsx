import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTask, findTask, deleteTask } from '../store/actions';
import { Row, Modal, Button, Table, Steps, Divider, Tag, message } from 'antd';
import CreateTask from '../subComponents/createTask';
import HtmlModal from '../subComponents/htmlModal';
import ReportModal from '../subComponents/reportModal';
import { withTranslation } from 'react-i18next';
import metricsData from '../subComponents/metrics';
import axios from 'axios';

const { categories, metrics } = metricsData;

const { Step } = Steps;

class Style extends Component {
  state = {
    loading: false,
    visible: false,
    htmlModalVisible: false,
    reportModalVisible: false,
    img: '',
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

  showReportModal = img => {
    this.setState({
      reportModalVisible: true,
      img
    });
  };

  showReportModalDirectly = result => {
    this.setState({
      reportModalVisible: true,
      result
    });
  };

  reportModalOk = () => {
    this.setState({
      reportModalVisible: false,
      img: '',
      result: null
    });
  };

  reportModalCancel = () => {
    this.setState({
      reportModalVisible: false,
      img: '',
      result: null
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
        if (values.componentDataId && values.colorDataId) {
          if (values.settings.every(i => !i)) {
            message.error('请设置参数');
            this.setState({
              loading: false
            });
            return;
          }
          createTask(values);
          this.setState({
            loading: false,
            visible: false
          });
          this.refs.taskForm.resetFields();
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

  getScore = result => {
    return Object.keys(result).reduce((score, i) => {
      result[i].forEach((v, idx) => {
        const scores = metrics[i].results[idx].scores;
        let val = v.toFixed(2);
        if (scores.length === 1) {
          return;
        }
        const s = metrics[i].results[idx].scores.find(j => j.range[0] <= val && (j.range[1] >= val || j.range[1] === null));
        if (s) {
          score[s.judgment] += 1;
        } else {
          console.log(scores, v)
        }
      })
      return score;
    }, {
      bad: 0,
      good: 0,
      normal: 0
    });
  }

  getSummary = record => {
    if (record.state !== '执行结束') {
      return null;
    }
    const scores = [];

    const summary = record.subTasks.map((i, idx) => {
      const result = i.taskList.find(j => j.name === 'evaluate').result || [];
      const score = this.getScore(result);
      const count = score.good - score.bad;
      scores.push({ idx, count });
      return (<p>参数组合{idx + 1}：完成 {Object.keys(result).length} / 14 评估项目&nbsp;
        <Tag color="blue">Good: {score.good}</Tag>
        <Tag color="green">Normal: {score.normal}</Tag>
        <Tag color="red">Bad: {score.bad}</Tag>
        总分：{score.good - score.bad}
      </p>);
    });

    scores.sort((a, b) => b.count - a.count);

    return (<div>
      <Divider>评估结果对比</Divider>
      {summary}
      <p style={{fontWeight: 700}}>参数组合{scores.filter(i => i.count === scores[0].count).map(i => i.idx).join('，')}的替换效果最佳</p>
    </div>)
  }

  render() {
    const { visible, loading, htmlModalVisible, html, style, reportModalVisible, img, result } = this.state;
    const { data, findTask, teamData, t, deleteTask } = this.props;
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
        key: 'state',
        render: state => t(state)
      },
      {
        title: 'ColorDataName',
        dataIndex: 'colorDataName',
        key: 'colorDataName',
        render: record => !!record && record.name
      },
      {
        title: 'ComponentDataNames',
        dataIndex: 'componentDataNames',
        key: 'componentDataNames',
        render: record => (record || []).map(i => i.name).join(',')
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
          <span>{record.state === '执行结束' && (<a onClick={() => deleteTask(record._id)}>{t('删除')}</a>)}</span>
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
            {t('新建风格更换任务')}
          </Button>
          <Button
            type="primary"
            icon="redo"
            style={{ marginLeft: '10px' }}
            onClick={findTask}
          >
            {t('刷新数据')}
          </Button>
        </div>
        <Row style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            onExpand={this.onExpand}
            expandedRowRender={record => (
              <div>
                {extraInfo(record.err, 'Error')}
                {this.getSummary(record)}
                {
                  record.subTasks.map((task, i) => (
                    <div key={i}>
                      <Divider>{`参数组合${i+1}执行情况`}</Divider>
                      {extraInfo({
                        pac: task.pac,
                        threshold1: task.threshold1,
                        threshold2: task.threshold2
                      }, 'Settings')}
                      {
                        <div>
                          <p style={{ margin: 0 }}>
                            <label style={{ fontWeight: 700 }}>Actions:</label>
                          </p>
                          { !!task.data && <Button onClick={() => this.showHtmlModal(task.data)}>查看结果页面</Button>}
                          { !!task.data && <Button onClick={() => this.showReportModalDirectly(task.taskList.find(i => i.name === 'evaluate').result)}>查看评估报告</Button>}
                        </div>
                      }
                      {!!task.taskList && (
                        <Steps
                          type="navigation"
                          size="small"
                          current={task.taskList.length - 1}
                          style={{
                            marginBottom: 60,
                            boxShadow: '0px -1px 0 0 #e8e8e8 inset'
                          }}
                        >
                          {task.taskList.map((item, j) => (
                            <Step
                              key={j}
                              title={item.name}
                              subTitle={
                                item.wait ? `${t('执行中')}...` : item.time / 1000 + 's'
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
                                  {item.name === 'evaluate' && !!item.result && (
                                    <div>
                                      <p>完成 {Object.keys(item.result).length} / 14 评估项目</p>
                                      <p><Tag color="blue">Good: {this.getScore(item.result).good}</Tag></p>
                                      <p><Tag color="green">Normal: {this.getScore(item.result).normal}</Tag></p>
                                      <p><Tag color="red">Bad: {this.getScore(item.result).bad}</Tag></p>
                                    </div>
                                  )}
                                </div>
                              }
                            />
                          ))}
                        </Steps>
                      )}
                    </div>
                  ))
                }
              </div>
            )}
            dataSource={data}
          />
        </Row>
        <Modal
          width={800}
          visible={visible}
          title={t('新建风格更换任务')}
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
        <ReportModal
          visible={reportModalVisible}
          onOk={this.reportModalOk}
          onCancel={this.reportModalCancel}
          img={img}
          result={result}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.taskData || [],
  teamData: state.teamData || []
});

export default connect(mapStateToProps, { createTask, findTask, deleteTask })(withTranslation('translation', { withRef: true })(Style));
