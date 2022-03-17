import React, { createContext, useCallback, useState, useContext } from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useLocation, useNavigate, Path } from "react-router-dom";

import { api } from "../services";
import { useToast } from "./useToast";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

interface AuthState {
  token: string | null;
  id: string | null;
  firstName?: string | null;
  lastName?: string | null;
  rating: string | null;
}

interface AuthContextData {
  token: string | null;
  id: string | null;
  firstName?: string | null;
  lastName?: string | null;
  rating: string | null;

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
    const id = localStorage.getItem("@weStudy:id");
    const firstName = localStorage.getItem("@weStudy:firstName");
    const lastName = localStorage.getItem("@weStudy:lastName");
    const rating = localStorage.getItem("@weStudy:rating");

    if (token && id && rating) {
      api.defaults.headers.common.authorization = token;
      try {
        return {token, id, firstName, lastName, rating};
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
        const { token, id, firstName, lastName, rating } = response.data;
        localStorage.setItem("@weStudy:token", token);
        localStorage.setItem("@weStudy:id", id);
        localStorage.setItem("@weStudy:firstName", firstName);
        localStorage.setItem("@weStudy:lastName", lastName);
        localStorage.setItem("@weStudy:rating", rating);

        api.defaults.headers.common.authorization = token;

        setData({ token, id, firstName, lastName, rating });
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
        const { token, id, firstName, lastName, rating } = response.data;
        localStorage.setItem("@weStudy:token", token);
        localStorage.setItem("@weStudy:id", id);
        localStorage.setItem("@weStudy:firstName", firstName);
        localStorage.setItem("@weStudy:lastName", lastName);
        localStorage.setItem("@weStudy:rating", rating);

        api.defaults.headers.common.authorization = token;

        setData({ token, id, firstName, lastName, rating });
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
    localStorage.removeItem("@weStudy:id");
    localStorage.removeItem("@weStudy:firstName");
    localStorage.removeItem("@weStudy:lastName");
    localStorage.removeItem("@weStudy:rating");

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: data.token,
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        rating: data.rating,

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
