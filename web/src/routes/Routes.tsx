import {
  Routes as ReactDOMRoutes,
  Route as ReactDOMRoute,
  Navigate,
  useLocation,
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
  const location = useLocation();

  if (visibility === "signedOut" && token) {
    const redirectPath = routes.dashboard.path;
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (visibility === "signedIn" && !token) {
    const redirectPath = routes.signIn.path;
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
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
