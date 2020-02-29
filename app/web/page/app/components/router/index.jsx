import Style from './style';
import Color from './color';
import Catcher from './catcher';
import Component from './component';
import Dashboard from './dashboard';
import Teams from './teams';
const NotFound = () => {
  return (
    <Route render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = 404;
      }
      return (
        <div>
          <h1>404 : Not Found</h1>
        </div>
      );
    }}/>
  );
  
};
const routes = [
  {
    path: '/color',
    component: Color
  },
  {
    path: '/style',
    component: Style
  },
  {
    path: '/catcher',
    component: Catcher
  },
  {
    path: '/component',
    component: Component
  },
  {
    path: '/teams',
    component: Teams
  },
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
