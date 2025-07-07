// CRUD Operation functions on Habits :

import { Habit } from "@/types";
import { ID, Models } from "react-native-appwrite";
import {
  COMPLETION_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
} from "./appwrite";

export const handleDeleteHabit = async (id: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
  } catch (error) {
    console.log(error);
  }
};

export const handleCompleteHabit = async (
  id: string,
  user: Models.User<Models.Preferences> | null,
  habits: Habit[],
  completedHabits: string[]
) => {
  if (!user || completedHabits.includes(id)) return;

  // When a habit is marked as completed, we need to create a new entry in the habit_completion collection and update the habit collection(streak_count and last_completed).
  try {
    const currentDate = new Date().toISOString();

    await databases.createDocument(
      DATABASE_ID,
      COMPLETION_COLLECTION_ID,
      ID.unique(),
      {
        user_id: user.$id,
        habit_id: id,
        completed_at: currentDate,
      }
    );

    const habit = habits?.find((h) => h.$id === id);

    if (!habit) return;

    await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
      streak_count: habit.streak_count + 1,
      last_completed: currentDate,
    });
  } catch (error) {
    console.error(error);
  }
};
