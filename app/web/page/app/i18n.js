import i18n from 'i18next';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

const lng = Cookies.get('lng') || 'en';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      // layout
      '前端风格自动替换工具': 'Frontend Auto Change Style Tool',
      '主页': 'Dashboard',
      '工作站': 'Workspace',
      '更换风格': 'Change Style',
      '色彩数据': 'Color Data',
      '组件数据': 'Component Data',
      '事件捕捉': 'Event Catcher',
      '团队': 'Teams',
      // common
      '秒': 's',
      '执行成功': 'success',
      '执行失败': 'failed',
      '执行结束': 'execution end',
      '子任务执行失败': 'sub task failed',
      '刷新数据': 'refresh data',
      '子页面url': 'url of subpage',
      '请输入子页面url或删除此项': 'please input or just delete',
      '站点名称': 'site name',
      '请输入正确的站点名称!': 'please input correct site name!',
      '请输入站点名称!': 'please input site name!',
      '基础url': 'base url',
      '请输入正确的url!': 'please input correct url',
      '请输入url!': 'please input url',
      '添加子页面': 'add subpage',
      '批量添加': 'batch add',
      '输入多个子页面，以逗号分隔，并点击下方按钮完成批量添加': 'Enter multiple subpages, separated by commas, and click the button below to complete the batch add',
      '批量添加子页面': 'complete the batch add',
      '分片粒度': 'segmentation granularity',
      '请输入0到10的数字!': 'Please enter a number from 0 to 10',
      '0到10之间，越大代表粒度越粗': 'Between 0 and 10, the larger the coarser the granularity',
      '分享到团队': 'share with team',
      '没有可用的颜色数据，去创建': 'No color data available, go to create',
      '没有团队，去创建': 'No team, go to create',
      '没有可用的组件数据，去创建': 'No component data available, go to create',
      // color
      '新建色彩数据': 'create new color data',
      '原始数据': 'original data',
      '背景色按面积分布情况': 'Background color distribution by area',
      '背景色按出现频率分布情况': 'Background color distribution by frequency of occurrence',
      '字体颜色按字符数分布情况': 'Font color distribution by number of characters',
      // color
      '新建组件数据': 'create new component data',
      // codeModal
      'css代码': 'css code',
      // htmlModal
      '查看页面CSS（不含替换组件部分，仅供参考）': 'View page CSS (excluding replacement components, for reference only)',
      '页面内容': 'page content',
      // createTask
      '站点url': 'site url',
      '更换组件': 'replace component',
      '组件数据源': 'component data source',
      '停止阈值': 'top threshold',
      '相似度达到此值时不继续匹配，设置为1则总是不停止': 'When the similarity reaches this value, it will not continue to match, if it is set to 1, it will never stop.',
      '下限阈值': 'Lower limit threshold',
      '相似度未达到此值时不发生匹配，设置为0则总是发生替换': 'When the similarity does not reach this value, no matching will occur. If it is set to 0, the replacement will always occur.',
      '更换颜色': 'replace color',
      '颜色数据源': 'color data source',
      '背景色替换规则': 'background color replace rule',
      // style
      '点击查看网页': 'click to preview page',
      '新建风格更换任务': 'create new style change task',
      '执行中': 'executing',
      // teams
      '新建团队': 'create a new team',
      '团队名称': 'team name',
      '请输入团队名称!': 'please input team name',
      '团队描述': 'team description',
      '请输入团队描述!': 'please input team description',
      '成员可邀请其他人加入': 'members can invite others to join',
      '用户名': 'username',
      '请输入用户名!': 'please input username',
      '邀请用户': 'invite',
      '近期任务': 'recent task',
      '近期颜色数据': 'recent color data',
      '近期组件数据': 'recent component data'
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;