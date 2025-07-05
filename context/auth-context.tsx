import getUser from "@/lib/GetUserFunction";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { authFunc } from "../lib/AuthFunctions";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const { signUp, signIn } = authFunc;

  useEffect(() => {
    async function getUserInfo() {
      const session = await getUser();
      setUser(session);
      setIsLoadingUser(false);
    }

    getUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signIn, signUp }}>
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
