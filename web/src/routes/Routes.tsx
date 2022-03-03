import {
  Routes as ReactDOMRoutes,
  Route as ReactDOMRoute,
  Navigate,
} from "react-router-dom";
import { routes } from "./appRoutes";
import { useAuth } from "../hooks";
import { FunctionComponent } from "react";

interface RouterProxyProps {
  visibility: "signedIn" | "signedOut" | "public";
  component: JSX.Element;
}

const RouterProxy: FunctionComponent<RouterProxyProps> = ({
  visibility,
  component,
}) => {
  const { token } = useAuth();

  if (visibility === "signedOut" && token) {
    const redirectPath = routes.dashboard.path;
    return <Navigate to={redirectPath} />;
  }

  if (visibility === "signedIn" && !token) {
    const redirectPath = routes.signIn.path;
    return <Navigate to={redirectPath} />;
  }

  // visibility === "public"
  return component;
};

export function Routes() {
  return (
    <ReactDOMRoutes>
      {Object.keys(routes).map((key) => {
        const { path, component, visibility } = routes[key];

        return (
          <ReactDOMRoute
            key={key}
            path={path}
            element={
              <RouterProxy visibility={visibility} component={component} />
            }
          />
        );
      })}
    </ReactDOMRoutes>
  );
}
