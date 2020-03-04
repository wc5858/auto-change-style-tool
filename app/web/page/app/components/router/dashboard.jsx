import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Row, Card, Col, List } from 'antd';
import Avatar from '../subComponents/avatar';
import './dashboard.less';

class Dashboard extends Component {
  render() {
    const { teamData, taskData, t, colorData, componentData } = this.props;
    return <div className="redux-nav-item">
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期任务')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {taskData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期颜色数据')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {colorData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title={t('近期组件数据')}
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {componentData.slice(0, 6).map(item => (
              <Card.Grid className="project-grid" key={item._id}>
                <Link to="/style">
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={item.site}
                      description={`created by ${item.creator}`}
                    />
                    <div>{t(item.state)}</div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
            bordered={false}
            title={t('团队')}
            loading={false}
          >
            <div className="dashboard-teams">
              <Row gutter={48}>
                {teamData.map(item => (
                  <Col span={12} key={item._id}>
                    <div className="dashboard-team">
                      <Avatar value={item.avatar} size="small" />
                      <span className="team-name">{item.teamName}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>;
  }
}

const mapStateToProps = state => ({
  teamData: state.teamData || [],
  taskData: state.taskData || [],
  colorData: state.colorData || [],
  componentData: state.componentData || []
});

export default connect(mapStateToProps, {})(withTranslation('translation', { withRef: true })(Dashboard));