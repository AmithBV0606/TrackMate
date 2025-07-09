import { useAuth } from "@/context/auth-context";
import {
  client,
  COMPLETION_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
} from "@/lib/appwrite";
import { getStreakData } from "@/lib/CRUD";
import { Habit, HabitCompletion, RealtimeResponse } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

const ORANGE = "#FF8800";
const BLACK = "#111";
const DARK_CARD = "#2A2B2A";
const LIGHT_TEXT = "#fff";
const SUB_TEXT = "#B0B0B0";

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);

  const { user } = useAuth();

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
  const fetchCompletions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETION_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );

      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions);
    } catch (error) {
      console.error(error);
    }
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
            fetchCompletions();
          }
        }
      );

      fetchHabits();
      fetchCompletions();

      return () => {
        habitsSubscription();
        completionSubscription();
      };
    }
  }, [user]);

  // Ranking Habits by Streak
  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(
      habit.$id,
      completedHabits
    );

    return { habit, streak, bestStreak, total };
  });

  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);

  // console.log(rankedHabits.map((h) => h.habit.title));

  const badgeStyles = [styles.badge1, styles.badge2, styles.badge3];

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineSmall">
        Habit Streaks
      </Text>

      {/* Building Top 3 Habit Leaderboard : */}
      {rankedHabits.length > 0 && (
        <View style={styles.rankingContainer}>
          <Text style={styles.rankingTitle}>🏆 Top Streaks</Text>

          {rankedHabits.slice(0, 3).map((item, key) => (
            <View key={key} style={styles.rankingRow}>
              {/* Rank number : */}
              <View style={[styles.rankingBadge, badgeStyles[key]]}>
                <Text style={styles.rankingBadgeText}>{key + 1}</Text>
              </View>

              {/* Top rank habit's title : */}
              <Text style={styles.rankingHabit}>{item.habit.title}</Text>

              {/* Top rank habit's bestStreak : */}
              <Text style={styles.rankingStreak}>{item.bestStreak}</Text>
            </View>
          ))}
        </View>
      )}

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No Habits yet. Add your first Habit!!
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.streaksContainer}
        >
          {rankedHabits.map(({ habit, streak, bestStreak, total }, key) => (
            <Card
              key={key}
              style={[styles.card, key === 0 && styles.firstCard]}
            >
              <Card.Content>
                <Text variant="titleMedium" style={styles.habitTitle}>
                  {habit.title}
                </Text>

                <Text style={styles.habitDescription}>{habit.description}</Text>

                <View style={styles.statsRow}>
                  {/* Current Streak : */}
                  <View style={styles.statsBadge}>
                    <Text style={styles.statsText}>🔥 {streak}</Text>
                    <Text style={styles.statsLabel}>Current</Text>
                  </View>

                  {/* Best Streak : */}
                  <View style={styles.statsBadgeGold}>
                    <Text style={styles.statsText}>🏆 {bestStreak}</Text>
                    <Text style={styles.statsLabel}>Best</Text>
                  </View>

                  {/* Total Streak : */}
                  <View style={styles.statsBadgeGreen}>
                    <Text style={styles.statsText}>✅ {total}</Text>
                    <Text style={styles.statsLabel}>Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: BLACK,
    marginBottom: 60,
  },
  title: {
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 16,
    color: ORANGE,
  },
  rankingContainer: {
    backgroundColor: DARK_CARD,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // marginBottom: 10,
  },
  rankingTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
    color: ORANGE,
    letterSpacing: 0.5,
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: DARK_CARD,
    paddingBottom: 8,
  },
  rankingBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#444",
  },
  badge1: { backgroundColor: "#FFD700" }, // Gold
  badge2: { backgroundColor: "#C0C0C0" }, // Silver
  badge3: { backgroundColor: "#CD7F32" }, // Bronze
  rankingBadgeText: {
    fontWeight: "bold",
    color: BLACK,
    fontSize: 15,
  },
  rankingHabit: {
    flex: 1,
    fontSize: 15,
    color: LIGHT_TEXT,
    fontWeight: "bold",
  },
  rankingStreak: {
    fontSize: 14,
    color: ORANGE,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: SUB_TEXT,
    fontSize: 16,
    fontWeight: "bold",
  },
  streaksContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: BLACK,
    marginTop: 20,
  },
  card: {
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: DARK_CARD,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: DARK_CARD,
  },
  firstCard: {
    borderWidth: 2,
    borderColor: ORANGE,
  },
  habitTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
    color: LIGHT_TEXT,
  },
  habitDescription: {
    marginBottom: 8,
    color: SUB_TEXT,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },
  statsBadge: {
    backgroundColor: "#2d1600",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },
  statsBadgeGold: {
    backgroundColor: "#FFD70022",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },
  statsBadgeGreen: {
    backgroundColor: "#22C55E22",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },
  statsText: {
    fontWeight: "bold",
    fontSize: 15,
    color: ORANGE,
  },
  statsLabel: {
    fontSize: 11,
    color: SUB_TEXT,
    marginTop: 2,
    fontWeight: "500",
  },
});
