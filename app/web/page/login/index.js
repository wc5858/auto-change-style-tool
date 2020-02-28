import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import LoginPage from './login';


const clientRender = () => {
  // 登录页面比较简单， 就不使用store增加复杂度了
  const state = window.__INITIAL_STATE__;
  const Entry = () => (<div>
    <LoginPage url={state.url} />
  </div>
  );
  const render = Page => {
    ReactDOM.hydrate(EASY_ENV_IS_DEV ? <AppContainer><Page /></AppContainer> : <Page />, document.getElementById('app'));
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

// 这里的async不能去掉，这可能是使用的ssr框架没有做好兼容性导致的
// 或者换成Promise.resolve()
const serverRender = async context => {
  const { url } = context.state;
  return () => <LoginPage url={url} />;
};

export default EASY_ENV_IS_NODE ? serverRender : clientRender();