import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { Group } from "../pages/Group";
import { Dashboard } from "../pages/Dashboard";
import { GroupInvite } from "../pages/GroupInvite";

interface AppRoute {
  path: string;
  component: JSX.Element;
  visibility: "signedIn" | "signedOut" | "public";
}

export const routes: Record<string, AppRoute> = {
  home: {
    path: "/",
    component: <Home />,
    visibility: "signedOut",
  },
  signIn: {
    path: "/sign-in",
    component: <SignIn />,
    visibility: "signedOut",
  },
  groupInvite: {
    path: "/invite",
    component: <GroupInvite />,
    visibility: "signedIn",
  },
  dashboard: {
    path: "/dashboard",
    component: <Dashboard />,
    visibility: "signedIn",
  },
  group: {
    path: "/group/:groupId",
    component: <Group />,
    visibility: "signedIn",
  },
  noMatch: {
    path: "*",
    component: <>No Match!</>,
    visibility: "public",
  },
};
