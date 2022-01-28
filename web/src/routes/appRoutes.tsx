import { Home } from '../pages/Home';
import { SignIn } from '../pages/SignIn';

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
    component: <>Dashboard Page</>,
    isPrivate: true,
  },
  myAccount: {
    path: '/my-account',
    component: <>MyAccount Page</>,
    isPrivate: true,
  },
  signOut: {
    path: '/sign-out',
    component: <>SignOut Page</>,
    isPrivate: true,
  },
};
