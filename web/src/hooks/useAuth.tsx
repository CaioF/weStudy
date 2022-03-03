import React, { createContext, useCallback, useState, useContext } from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import { api } from "../services";
import { useToast } from "./useToast";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

interface AuthState {
  token: string | null;
}
interface AuthContextData {
  token: string | null;
  googleClientId: string;
  isLoading: boolean;
  signOut(): void;
  onGoogleSignInSuccess(
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void;
  onGoogleSignUpSuccess(
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@weStudy:token");

    if (token) {
      api.defaults.headers.common.authorization = token;
      try {
        return { token };
      } catch (err) {
        console.log(err);
      }
    }

    return {} as AuthState;
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  function onGoogleSignInSuccess(res: GoogleLoginResponse): void {
    setIsLoading(true);
    api
      .post("/secure/auth", {
        token: res.tokenId,
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("@weStudy:token", token);

        api.defaults.headers.common.authorization = token;

        setData({ token });
        setIsLoading(false);
        showToast({
          status: "success",
          title: "Authentication",
          description: "You are signed in",
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        showToast({
          status: "success",
          title: "Authentication",
          description: "Could not sign in. Please try again.",
        });
      });
  }

  function onGoogleSignUpSuccess(res: GoogleLoginResponse): void {
    setIsLoading(true);
    api
      .post("/secure/signUp", {
        token: res.tokenId,
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("@weStudy:token", token);

        api.defaults.headers.common.authorization = token;

        setData({ token });
        setIsLoading(false);
        showToast({
          status: "success",
          title: "Authentication",
          description: "You are signed in",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        showToast({
          status: "error",
          title: "Authentication",
          description: "Could not sign up. Please try again.",
        });
      });
  }

  const signOut = useCallback(() => {
    localStorage.removeItem("@weStudy:token");
    localStorage.removeItem("@weStudy:user");

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: data.token,
        googleClientId: GOOGLE_CLIENT_ID,
        isLoading,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
