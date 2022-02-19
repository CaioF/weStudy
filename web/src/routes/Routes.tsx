import {
  Routes as ReactDOMRoutes,
  Route as ReactDOMRoute,
  Navigate,
} from 'react-router-dom';
import { routes } from './appRoutes';
import { useAuth } from '../hooks';
import { FunctionComponent } from 'react';

interface PrivateRouteProps {
  isPrivate: boolean;
  component: JSX.Element;
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({
  isPrivate,
  component,
}) => {
  const { user } = useAuth();

  return isPrivate === !!user ? (
    component
  ) : (
    <Navigate to={isPrivate ? routes.home.path : routes.dashboard.path} />
  );
};

export function Routes() {
  return (
    <ReactDOMRoutes>
      {Object.keys(routes).map(key => {
        const { path, component, isPrivate } = routes[key];

        return (
          <ReactDOMRoute
            key={key}
            path={path}
            element={
              <PrivateRoute isPrivate={!!isPrivate} component={component} />
            }
          />
        );
      })}
    </ReactDOMRoutes>
  );
}