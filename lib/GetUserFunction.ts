import { account } from "./appwrite";

async function getUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default getUser;