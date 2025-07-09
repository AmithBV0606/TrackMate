// To mark the habit as completed :

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function RenderRightActions(
  isHabitCompleted: (habitId: string) => boolean,
  habitId: string
) {
  const res = isHabitCompleted(habitId);

  return (
    <View style={styles.swipeActionRight}>
      {res ? (
        <Text style={styles.completed}>Completed!</Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color={"#fff"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#22C55E", // vibrant green
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  completed: {
    color: "#ffffff",
    fontWeight: 600,
  },
});
