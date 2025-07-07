import { FREQUENCIES } from "@/constants";
import { Models } from "react-native-appwrite";

export type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export type FrequencyType = (typeof FREQUENCIES)[number];

export interface Habit extends Models.Document {
  user_id: string;
  title: string;
  description: string;
  streak_count: number;
  last_completed: string;
  frequency: string;
  created_at: string;
}

export interface RealtimeResponse {
  events: string[];
  payload: any;
}

export interface HabitCompletion extends Models.Document {
  user_id: string;
  habit_id: string;
  completed_at: string;
}
