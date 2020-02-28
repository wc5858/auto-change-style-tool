import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Row, Card, Col, List } from 'antd';

import './dashboard.less';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack'
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'  // Webpack
];

const notice = [{
  id: 'xxx1',
  title: titles[0],
  logo: avatars[0],
  description: '那是一种内在的东西，他们到达不了，也无法触及的',
  updatedAt: new Date(),
  member: '科学搬砖组',
  href: '',
  memberLink: ''
},
{
  id: 'xxx2',
  title: titles[1],
  logo: avatars[1],
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  updatedAt: new Date('2017-07-24'),
  member: '全组都是吴彦祖',
  href: '',
  memberLink: ''
},
{
  id: 'xxx3',
  title: titles[2],
  logo: avatars[2],
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  updatedAt: new Date(),
  member: '中二少女团',
  href: '',
  memberLink: ''
},
{
  id: 'xxx4',
  title: titles[3],
  logo: avatars[3],
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  updatedAt: new Date('2017-07-23'),
  member: '程序员日常',
  href: '',
  memberLink: ''
},
{
  id: 'xxx5',
  title: titles[4],
  logo: avatars[4],
  description: '凛冬将至',
  updatedAt: new Date('2017-07-23'),
  member: '高逼格设计天团',
  href: '',
  memberLink: ''
},
{
  id: 'xxx6',
  title: titles[5],
  logo: avatars[5],
  description: '生命就像一盒巧克力，结果往往出人意料',
  updatedAt: new Date('2017-07-23'),
  member: '骗你来学计算机',
  href: '',
  memberLink: ''
}];



class Catcher extends Component {
  render() {
    return <div className="redux-nav-item">
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title="近期任务"
            bordered={false}
            loading={false}
            bodyStyle={{ padding: 0 }}
          >
            {notice.map(item => (
              <Card.Grid className="project-grid" key={item.id}>
                <Card bodyStyle={{ padding: 0 }} bordered={false}>
                  <Card.Meta
                    title={
                      <div className="cardTitle">
                        {/* <Avatar size="small" src={item.logo} /> */}
                        <Link to={item.href}>{item.title}</Link>
                      </div>
                    }
                    description={item.description}
                  />
                  <div className="projectItemContent">
                    <Link to={item.memberLink}>{item.member || ''}</Link>
                    {item.updatedAt && (
                      <span className="datetime" title={item.updatedAt}>
                        {/* {moment(item.updatedAt).fromNow()} */}
                      </span>
                    )}
                  </div>
                </Card>
              </Card.Grid>
            ))}
          </Card>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className="active-card"
            title="动态"
            loading={false}
          >
            <List loading={false} size="large">
              {/* <div className={styles.activitiesList}>{this.renderActivities()}</div> */}
            </List>
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
            bordered={false}
            title="团队"
            loading={false}
          >
            <div className="dashboard-members">
              <Row gutter={48}>
                {notice.map(item => (
                  <Col span={12} key={`members-item-${item.id}`}>
                    <Link to={item.href}>
                      {/* <Avatar src={item.logo} size="small" /> */}
                      <span className="dashboard-member">{item.member}</span>
                    </Link>
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

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(Catcher);