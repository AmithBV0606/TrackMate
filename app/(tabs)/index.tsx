import RenderRightActions from "@/components/render-left-actions";
import RenderLeftActions from "@/components/render-right-actions";
import { useAuth } from "@/context/auth-context";
import {
  client,
  COMPLETION_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
} from "@/lib/appwrite";
import { handleCompleteHabit, handleDeleteHabit } from "@/lib/CRUD";
import { Habit, HabitCompletion, RealtimeResponse } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const { user, signOut } = useAuth();

  // Fetch habits from the "habits" collections :
  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );

      // console.log(response);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch habits from "habit_completion" collections :
  const fetchTodaysCompletions = async () => {
    try {
      // Today's date(Resets the date to midnight)  :
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch completed habits, that was completed today after midnight, from the "habit_completion" collections :
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETION_COLLECTION_ID,
        [
          Query.equal("user_id", user?.$id ?? ""),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ]
      );

      // Create a state variable of an array of strings, fill it only with the "habit_id" of the habits that were completed after today's midnight.
      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };

  // To change the color of the completed habit card :
  const isHabitCompleted = (habitId: string) => {
    return completedHabits.includes(habitId);
  };

  useEffect(() => {
    if (user) {
      // Habits collection subscription :
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      // habit_completion collection subscription :
      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETION_COLLECTION_ID}.documents`;
      const completionSubscription = client.subscribe(
        completionsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchTodaysCompletions();
          }
        }
      );

      fetchHabits();
      fetchTodaysCompletions();

      return () => {
        habitsSubscription();
        completionSubscription();
      };
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Header : */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Today&apos;s Habit
        </Text>

        <Button
          style={styles.signOutBTN}
          mode="text"
          onPress={signOut}
          icon={"logout"}
          textColor="#FF8800"
        >
          Sign Out
        </Button>
      </View>

      {/* To display habits : */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 15 }}
      >
        {habits?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No Habits yet. Add your first Habit!!
            </Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable
              key={key}
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={() =>
                RenderLeftActions(isHabitCompleted, habit.$id)
              }
              renderRightActions={RenderRightActions}
              onSwipeableOpen={(direction) => {
                // This is opposite i.e "right" means swipe left and "left" means swipe right
                if (direction === "right") {
                  handleDeleteHabit(habit.$id);
                } else if (direction === "left") {
                  handleCompleteHabit(habit.$id, user, habits, completedHabits);
                }

                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <Surface
                style={[
                  styles.card,
                  isHabitCompleted(habit.$id) && styles.cardCompleted,
                ]}
                elevation={0}
              >
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isHabitCompleted(habit.$id) && { color: BLACK },
                    ]}
                  >
                    {habit.title}
                  </Text>

                  <Text
                    style={[
                      styles.cardDescription,
                      isHabitCompleted(habit.$id) && { color: DARK_CARD },
                    ]}
                  >
                    {habit.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    {/* Streaks : */}
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color={ORANGE}
                      />

                      <Text style={styles.streakText}>
                        {habit.streak_count} days streak
                      </Text>
                    </View>

                    {/* Frequency : */}
                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>
                        {habit.frequency.charAt(0).toUpperCase() +
                          habit.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const ORANGE = "#FF8800";
const BLACK = "#111";
const DARK_CARD = "#2A2B2A";
const SUB_TEXT = "#B0B0B0";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: BLACK,
    marginBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 24,
    marginTop: 50,
  },
  signOutBTN: {
    backgroundColor: DARK_CARD,
    borderRadius: 8,
    color: ORANGE,
  },
  title: {
    fontWeight: "bold",
    color: ORANGE,
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: DARK_CARD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: SUB_TEXT,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1600",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: ORANGE,
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: ORANGE,
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "80%",
  },
  emptyStateText: {
    color: ORANGE,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardCompleted: {
    // backgroundColor: "#FF6633",
    backgroundColor: ORANGE,
    borderWidth: 1,
    color: BLACK,
  },
});
