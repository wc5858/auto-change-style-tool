import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import RegisterPage from './register';


const clientRender = () => {
  const state = window.__INITIAL_STATE__;
  const Entry = () => (<div>
    <RegisterPage url={state.url} />
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
  return () => <RegisterPage url={url} />;
};

export default EASY_ENV_IS_NODE ? serverRender : clientRender();