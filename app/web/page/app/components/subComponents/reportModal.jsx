import React, { Component } from 'react';
import { Modal, Button, Divider, Table, Collapse, Tooltip, Icon, Rate, message, Progress, Row, Col, Card } from 'antd';
import { connect } from 'react-redux';
import CodeModal from './codeModal';
import { withTranslation } from 'react-i18next';
import data from './metrics';
import axios from 'axios';

const { categories, metrics } = data;

const { Panel } = Collapse;
const { Meta } = Card;

const getReferences = references => <span>[{references.map((i, idx) => <span key={i.title}>{idx > 0 && ', '}<a href={`./public/publications/${i.fileName}`} target="_blank" title={i.title}>{idx + 1}</a></span>)}]</span>;

const columns = [
  {
    title: 'Metric',
    dataIndex: 'name',
    render: (name, record) => <span>{name}<Tooltip title={record.description}> <Icon type="question-circle-o" /></Tooltip></span>
  },
  {
    title: 'References',
    dataIndex: 'references',
    render: getReferences
  },
  {
    title: 'Evidence',
    dataIndex: 'evidence',
    render: i => <Rate defaultValue={i} disabled />
  },
  {
    title: 'Relevance',
    dataIndex: 'relevance',
    render: i => <Rate defaultValue={i} disabled />
  },
  {
    title: 'Computation time',
    dataIndex: 'speed',
    render: speed => speed === 2 ? <span style={{ color: 'green' }}>Fast</span> : speed === 1 ? <span style={{ color: 'orange' }}>Medium</span> : <span style={{ color: 'red' }}>Slow</span>
  }
];

const innerColumns = [
  {
    title: 'Result',
    dataIndex: 'name',
    render: (name, record) => <span>{name}{record.description && <Tooltip title={record.description}> <Icon type="question-circle-o" /></Tooltip>}</span>
  },
  {
    title: 'Value',
    dataIndex: 'val'
  },
  {
    title: 'Evaluation',
    dataIndex: 'scores',
    render: (scores, record) => {
      console.log(record)
      const score = scores.find(i => i.range[0] <= record.val && (i.range[1] >= record.val || i.range[1] === null));
      return <span>{score ? score.description : 'Meaningless'}</span>
    }
  }
];

class ReportModal extends Component {
  state = {
    report: false,
    metrics: [[], [], []],
    result: {},
    total: 0
  };

  onChange = (selectedRowKeys, selectedRows, i) => {
    const { metrics } = this.state;
    metrics[i] = selectedRows.map(i => i.id);
    this.setState({
      metrics
    });
  };

  onOk = async () => {
    const { onOk, img, result } = this.props;
    if (this.state.report || result) {
      this.onCancel();
      return;
    }
    const total = Array.prototype.concat.apply([], this.state.metrics);
    if (total.length === 0) {
      message.error('未选择评分项目，请选择');
      return;
    }
    if (process.browser) {
      const res = await axios({
        method: 'post',
        url: '/api/v1/task/img/base64',
        data: { img }
      });
      if (res.data.success) {
        const imgBase64 = res.data.data;
        const ws = new WebSocket('ws://interfacemetrics.aalto.fi/metric');
        this.ws = ws;
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'execute',
            url: '',
            data: `data:image/png;base64,${imgBase64}`,
            filename: img.split('/').pop(),
            metrics: total.reduce((map, i) => {
              map[i] = true;
              return map;
            }, {})
          }));
          this.setState({
            total: total.length,
            report: true
          });
        };
        ws.onmessage = event => {
          const data = JSON.parse(event.data);
          if (data.action === 'pushResult') {
            const { result } = this.state;
            result[data.metric] = data.result;
            this.setState({
              result
            });
          }
        };
        ws.onclose = () => {
          console.log('ws closed');
        };
      }
    }
  };

  onCancel = () => {
    this.setState({
      report: false,
      total: 0,
      metrics: [[], [], []],
      result: {}
    });
    this.ws && this.ws.close();
    this.props.onCancel();
  };

  render() {
    const { visible, onCancel, html, t, img } = this.props;
    const { report, total } = this.state;
    const result = this.props.result || this.state.result;
    return (
      <div>
        <Modal
          title={'report'}
          visible={visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width={'80%'}
        >
          {!report && img ? <Collapse defaultActiveKey={['0']}>
            {
              categories.map((i, idx) => (
                <Panel header={i.name} key={idx}>
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      onChange: (selectedRowKeys, selectedRows) => this.onChange(selectedRowKeys, selectedRows, idx)
                    }}
                    columns={columns}
                    dataSource={i.metrics.map(i => metrics[i])}
                    size="small"
                    pagination={false}
                  />
                </Panel>
              ))
            }
          </Collapse> : <div>
            <Row style={{marginBottom: 30}}>
              <Col span={16}>
                <Progress percent={Math.round(100 * Object.keys(result).length / total)} format={() => `${Object.keys(result).length} /  ${total} finished`} />
              </Col>
            </Row>
            {Object.keys(result).length > 0 && <Collapse defaultActiveKey={['0']}>
              {
                categories.filter(i => i.metrics.some(j => j in result)).map((i, idx) => (
                  <Panel header={i.name} key={idx}>
                    <Collapse defaultActiveKey={['0']}>
                      {
                        i.metrics.filter(j => j in result).map(m => (
                          <Panel header={metrics[m].name} key={m}>
                            <p>{metrics[m].description}</p>
                            <div>References: { getReferences(metrics[m].references) }</div>
                            <div>Evidence: <Rate defaultValue={metrics[m].evidence} disabled /></div>
                            <div>Relevance: <Rate defaultValue={metrics[m].relevance} disabled /></div>
                            {
                              metrics[m].visualizationType === 'table' ? <Table
                                columns={innerColumns}
                                dataSource={metrics[m].results.map((i, idx) => Object.assign(i, { val: result[m][idx] }))}
                                size="small"
                                pagination={false}
                                expandedRowRender={ record => (<div>
                                  <p>The histogram below shows the results of this metric for <em>Alexa top 500 global sites</em>. The list of sites was retrieved from <a href="https://www.alexa.com/topsites" target="_blank">https://www.alexa.com/topsites</a> on July 2, 2018 and their respective GUI designs were evaluated on December 18-19, 2018<sup>*</sup>.</p>
                                  <img src={`/public/histograms/${record.id}.png`} />
                                  <p style={{ fontSize: 11 }}><sup>*</sup>Country-specific, non-representative, and non-relevant sites were excluded from the list.</p>
                                </div>)}
                              /> : <div>{metrics[m].results.map((i, idx) => (
                                <Card
                                  style={{ width: '100%' }}
                                  cover={<img src={`data:image/png;base64,${result[m][idx]}`} />}
                                >
                                  <Meta title={i.name} description={i.description} />
                                </Card>))}</div>
                            }
                          </Panel>
                        ))
                      }
                    </Collapse>
                  </Panel>
                ))
              }
            </Collapse>}
          </div>}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(withTranslation('translation', { withRef: true })(ReportModal));
