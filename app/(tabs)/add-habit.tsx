import { StyleSheet, Text, View } from "react-native";

export default function AddHabitScreen() {
  return (
    <View style={styles.container}>
      <Text>Form for adding Habits!!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
