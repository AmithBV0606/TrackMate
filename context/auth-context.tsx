import React, { createContext, useContext } from "react";
import { authFunc } from "../lib/AuthFunctions";

type AuthContextType = {
  //   user: Models.User<Models.Preferences> | null;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signUp, signIn } = authFunc;

  return (
    <AuthContext.Provider value={{ signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("'useAuth' must be inside of the 'AuthContextProvider'!!");
  }

  return context;
}
