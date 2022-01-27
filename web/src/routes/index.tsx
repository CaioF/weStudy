import {
  Routes as ReactDOMRoutes,
  Route as ReactDOMRoute,
} from 'react-router-dom';
import { Home } from '../pages/Home';

interface Route {
  path: string;
  component: JSX.Element;
}

export const routes: Record<string, Route> = {
  home: {
    path: '/',
    component: <Home />,
  },
  signIn: {
    path: '/sign-in',
    component: <>SignIn page</>,
  },
  dashboard: {
    path: '/dashboard',
    component: <>Dashboard page</>,
  },
  myAccount: {
    path: '/my-account',
    component: <>MyAccount page</>,
  },
  signOut: {
    path: '/sign-out',
    component: <>SignOut page</>,
  },
};

export function Routes() {
  return (
    <ReactDOMRoutes>
      {Object.keys(routes).map(key => (
        <ReactDOMRoute
          key={key}
          path={routes[key].path}
          element={routes[key].component}
        />
      ))}
    </ReactDOMRoutes>
  );
}
