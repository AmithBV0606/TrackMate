import { ID } from "react-native-appwrite";
import { account } from "./appwrite";

async function signIn(email: string, password: string) {
  try {
    await account.createEmailPasswordSession(email, password);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }

    return "An error occured during Sign In!!";
  }
}

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

export const authFunc =  { signIn, signUp };
