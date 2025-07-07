import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "./appwrite";

export const handleDeleteHabit = async (id: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
  } catch (error) {
    console.log(error);
  }
};
