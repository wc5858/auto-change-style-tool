import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

class AddCatcher extends Component {
  render() {
    const { form, t, teamData, taskData } = this.props;
    const filteredTaskData = taskData.filter(item => !item.err && item.state === '执行结束');
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    return (
      <Form {...formItemLayout}>
        {
          filteredTaskData.length > 0 ?
            <Form.Item label={t('任务数据源')}>
              {getFieldDecorator('taskDataId', {
                initialValue: [filteredTaskData[0]._id]
              })(
                <Select>
                  {filteredTaskData
                    .filter(item => !item.err)
                    .map(({ _id, site }) => (
                      <Option value={_id} key={_id}>
                        {site}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item> :
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Link to="/task">{t('没有可用的任务数据，去创建')}</Link>
            </Form.Item>
        }
        <Form.Item {...formItemLayoutWithOutLabel}>
          {getFieldDecorator('share', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>{t('分享到团队')}</Checkbox>)}
        </Form.Item>
        {

          form.getFieldValue('share') &&
          (
            teamData.length > 0 ?
              <Form.Item label={t('团队')}>
                {getFieldDecorator('teamId', {
                  initialValue: teamData[0]._id
                })(
                  <Select>
                    {teamData
                      .map(({ _id, teamName }) => (
                        <Select.Option value={_id} key={_id}>
                          {teamName}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item> :
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Link to="/teams">{t('没有团队，去创建')}</Link>
              </Form.Item>
          )
        }
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  teamData: state.teamData || [],
  userInfo: state.userInfo || {},
  taskData: state.taskData
});

const WrappedAddCatcher = Form.create({ name: 'add_Catcher' })(
  connect(mapStateToProps, {})(withTranslation('translation', { withRef: true })(AddCatcher))
);
export default WrappedAddCatcher;

