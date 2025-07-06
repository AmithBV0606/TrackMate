import { FREQUENCIES, FrequencyType } from "@/constants";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<FrequencyType>("daily");

  return (
    <View style={styles.container}>
      <TextInput
        label={"Title"}
        mode="outlined"
        style={styles.input}
        onChangeText={setTitle}
      />

      <TextInput
        label={"Description"}
        mode="outlined"
        style={styles.input}
        onChangeText={setDescription}
      />

      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
          onValueChange={(value) => setFrequency(value as FrequencyType)}
          value={frequency}
        />
      </View>

      <Button mode="contained" disabled={!title || !description}>
        Add Habit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    marginTop: -50,
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
});
