import { account } from "@/lib/appwrite";
import { AuthContextType } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";

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

  // SignIn function using appwrite :
  async function signIn(email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during Sign In!!";
    }
  }

  // SignUp function using appwrite :
  async function signUp(email: string, password: string) {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during Sign Up!!";
    }
  }

  // getUser function using appwrite :
  async function getUser() {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn }}>
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
