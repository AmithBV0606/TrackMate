import { FREQUENCIES, FrequencyType } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const theme = useTheme();

  // Get the user :
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title: title,
          description: description,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          frequency: frequency,
          created_at: new Date().toISOString(),
        }
      );

      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an error creating the habit!!");
    }
  };

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

      {error && (
        <Text style={{ color: theme.colors.error, marginBottom: 15 }}>
          {error}
        </Text>
      )}

      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
      >
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
