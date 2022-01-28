import React, { createContext, useCallback, useState, useContext } from 'react';
import { api } from '../services';

interface User {
  id: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface AuthContextData {
  user: User;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@weStudy:token');
    const user = localStorage.getItem('@weStudy:user');

    if (token && user) {
      api.defaults.headers.common.authorization = token;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async () => {
    console.log('signIn');
    //TODO: make login api call
    const user = {
      id: 'fake_user_id',
    };
    const token = 'fake_token';

    localStorage.setItem('@weStudy:token', token);
    localStorage.setItem('@weStudy:user', JSON.stringify(user));

    api.defaults.headers.common.authorization = token;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    console.log('signOut');
    localStorage.removeItem('@weStudy:token');
    localStorage.removeItem('@weStudy:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
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
