// CRUD Operation functions on Habits :

import { Habit, HabitCompletion, StreakData } from "@/types";
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

export const getStreakData = (
  habitId: string,
  completedHabits: HabitCompletion[]
): StreakData => {
  const habitCompletions = completedHabits
    .filter((c) => c.habit_id === habitId)
    .sort(
      (a, b) =>
        new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );

  if (habitCompletions.length === 0) {
    return {
      streak: 0,
      bestStreak: 0,
      total: 0,
    };
  }

  // Build Streak data :
  let streak = 0;
  let bestStreak = 0;
  let total = habitCompletions.length;

  // To generate "streak" and "bestStreak", we need "lastDate" in which user completed the habit :
  let lastDate: Date | null = null;
  let currentStreak = 0;

  habitCompletions.forEach((c) => {
    const date = new Date(c.completed_at);

    if (lastDate) {
      const diff =
        (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diff <= 1.5) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) bestStreak = currentStreak;
    streak = currentStreak;
    lastDate = date;
  });

  return { streak, bestStreak, total };
};
