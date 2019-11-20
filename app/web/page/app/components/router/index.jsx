import Home from './home';
import Color from './color';
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
    path: '/',
    component: Home
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
