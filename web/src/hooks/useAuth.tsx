import React, { createContext, useCallback, useState, useContext } from 'react';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';

import { api } from '../services';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
export interface User {
  id: string;
  name: string;
}

interface AuthState {
  token: string;
  user: User;
}
interface AuthContextData {
  user: User;
  googleClientId: string;
  signOut(): void;
  onGoogleSignInSuccess(
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): void;
  onGoogleSignUpSuccess(
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@weStudy:token');
    const user = localStorage.getItem('@weStudy:user');

    if (token && user) {
      api.defaults.headers.common.authorization = token;
      try {
        return { token, user: JSON.parse(user) };
      } catch (err) {
        console.log(err);
      }
    }

    return {} as AuthState;
  });

  function onGoogleSignInSuccess(res: GoogleLoginResponse): void {
    api
      .post('/secure/auth', {
        token: res.tokenId,
      })
      .then(response => {
        const { token } = response.data;
        // @TODO: get user from response.data once it is implemented in the backend
        const user = {
          id: 'fake_id',
          name: 'fake_name',
        };
        localStorage.setItem('@weStudy:token', token);
        localStorage.setItem('@weStudy:user', JSON.stringify(user));

        api.defaults.headers.common.authorization = token;

        setData({ token, user });
      })
      .catch(err => console.error(err));
  }

  function onGoogleSignUpSuccess(res: GoogleLoginResponse): void {
    api
      .post('/secure/signUp', {
        token: res.tokenId,
      })
      .then(response => {
        const { token } = response.data;
        // @TODO: get user from response.data once it is implemented in the backend
        const user = {
          id: 'fake_id',
          name: 'fake_name',
        };

        localStorage.setItem('@weStudy:token', token);
        localStorage.setItem('@weStudy:user', JSON.stringify(user));

        api.defaults.headers.common.authorization = token;

        setData({ token, user });
      })
      .catch(err => console.error(err));
  }

  const signOut = useCallback(() => {
    localStorage.removeItem('@weStudy:token');
    localStorage.removeItem('@weStudy:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        googleClientId: GOOGLE_CLIENT_ID,
        onGoogleSignInSuccess,
        onGoogleSignUpSuccess,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
