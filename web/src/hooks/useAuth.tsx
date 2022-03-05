import React, { createContext, useCallback, useState, useContext } from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useLocation, useNavigate, Path } from "react-router-dom";

import { api } from "../services";
import { useToast } from "./useToast";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

interface User {
  name: string;
}

interface AuthState {
  token: string | null;
  user: User;
}

interface AuthContextData {
  user: User,
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
    const user = localStorage.getItem("@weStudy:user");

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

  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  function onGoogleSignInSuccess(res: GoogleLoginResponse): void {
    setIsLoading(true);

    api
      .post("/secure/auth", {
        token: res.tokenId,
      })
      .then((response) => {
        const { token, user } = response.data;
        localStorage.setItem("@weStudy:token", token);
        localStorage.setItem("@weStudy:user", JSON.stringify(user));

        api.defaults.headers.common.authorization = token;

        setData({ token, user });
        setIsLoading(false);
        showToast({
          status: "success",
          title: "Authentication",
          description: "You are signed in",
        });

        const state = location?.state as { from: Path };
        if (state) {
          navigate(state.from);
        }
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
        const { token, user } = response.data;
        localStorage.setItem("@weStudy:token", token);
        localStorage.setItem("@weStudy:user", JSON.stringify(user));

        api.defaults.headers.common.authorization = token;

        setData({ token, user });
        setIsLoading(false);
        showToast({
          status: "success",
          title: "Authentication",
          description: "You are signed in",
        });

        const state = location?.state as { from: Path };
        if (state) {
          navigate(state.from);
        }
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
        user: data.user,
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
