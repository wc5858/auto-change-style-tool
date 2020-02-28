import React, { PureComponent } from 'react';
import { Menu, Icon, Dropdown } from 'antd';
import styles from './selectLang.less';
import Cookies from 'js-cookie';
import i18n from 'i18next';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    i18n.changeLanguage(key);
    Cookies.set('lng', key);
  };

  render() {
    const { className } = this.props;
    const selectedLang = Cookies.get('lng') || 'en';;
    const locales = ['zh', 'en'];
    const languageLabels = {
      'zh': '简体中文',
      'en': 'English'
    };
    const languageIcons = {
      'zh': '🇨🇳',
      'en': '🇬🇧'
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span className="dropDown">
          <Icon type="global" />
        </span>
      </Dropdown>
    );
  }
}
