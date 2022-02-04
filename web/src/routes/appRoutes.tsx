import { Home } from '../pages/Home';
import { SignIn } from '../pages/SignIn';
import { Group } from '../pages/Group';
import { Dashboard } from '../pages/Dashboard';

interface AppRoute {
  path: string;
  component: JSX.Element;
  isPrivate?: boolean;
}

export const routes: Record<string, AppRoute> = {
  home: {
    path: '/',
    component: <Home />,
  },
  signIn: {
    path: '/sign-in',
    component: <SignIn />,
  },
  dashboard: {
    path: '/dashboard',
    component: <Dashboard />,
    isPrivate: true,
  },
  signOut: {
    path: '/sign-out',
    component: <>SignOut Page</>,
    isPrivate: true,
  },
  group: {
    path: '/group/:groupId',
    component: <Group />,
    isPrivate: true,
  },
  noMatch: {
    path: '*',
    component: <>No Match!</>,
  },
};
