import { FREQUENCIES } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { FrequencyType } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const ORANGE = "#FF8800";
const BLACK = "#111";
const DARK_CARD = "#2A2B2A";
const LIGHT_TEXT = "#fff";
const SUB_TEXT = "#5F595C";

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

    if (title.length === 0) {
      setError("Title field cannot be empty!!");
      return;
    }

    if (description.length === 0) {
      setError("Description field cannot be empty!!");
      return;
    }

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
      setError("");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an error creating the habit!!");
    }
  };

  // ✅ Reset the form when this screen is focused
  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setDescription("");
      setFrequency("daily");
      setError("");
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/TrackMate-Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Add a New Habit</Text>

      <TextInput
        label={"Title"}
        mode="outlined"
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        theme={{
          colors: {
            text: LIGHT_TEXT,
            placeholder: ORANGE,
            primary: ORANGE,
            background: DARK_CARD,
            surface: DARK_CARD,
          },
        }}
      />

      <Text style={styles.note}>
        <Text style={styles.boldNote}>Note</Text> : Keep the title short and
        descriptive.
      </Text>

      <TextInput
        label={"Description"}
        mode="outlined"
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        theme={{
          colors: {
            text: LIGHT_TEXT,
            placeholder: SUB_TEXT,
            primary: ORANGE,
            background: DARK_CARD,
            surface: DARK_CARD,
          },
        }}
      />

      <Text style={styles.note}>
        <Text style={styles.boldNote}>Note</Text> : Keep the description short
        (less than 100 letters).
      </Text>

      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
            checkedColor: ORANGE,
            showSelectedCheck: true,
            style: {
              borderColor: ORANGE,
              backgroundColor: frequency === freq ? "transparent" : "#1e1e1e",
            },
          }))}
          onValueChange={(value) => setFrequency(value as FrequencyType)}
          value={frequency}
          style={styles.segmented}
        />
      </View>

      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
        style={[
          styles.button,
          (!title || !description) && styles.disabledButton,
        ]}
        labelStyle={{
          color: !title || !description ? "#aaa" : BLACK,
          fontWeight: "bold",
        }}
      >
        Add Habit
      </Button>

      {(!title || !description) && (
        <Text style={[styles.note, { marginTop: 10 }]}>
          <Text style={styles.boldNote}>Note</Text> : The button is disabled.
          It&apos;ll enable itself when you enter title and description.
        </Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: BLACK,
    justifyContent: "center",
    marginTop: -80,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    color: ORANGE,
    fontWeight: "bold",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 16,
  },
  boldNote: {
    color: ORANGE,
    fontWeight: "bold",
    fontSize: 13,
  },
  note: {
    color: SUB_TEXT,
    fontSize: 13,
    marginLeft: 4,
    marginBottom: 30,
  },
  titleInput: {
    marginBottom: 4,
    backgroundColor: DARK_CARD,
    color: LIGHT_TEXT,
  },
  descriptionInput: {
    marginBottom: 4,
    backgroundColor: DARK_CARD,
    color: LIGHT_TEXT,
  },
  frequencyContainer: {
    marginBottom: 30,
  },
  segmented: {
    backgroundColor: DARK_CARD,
    borderRadius: 8,
  },
  errorText: {
    color: "#FF4C4C",
    marginTop: 10,
  },
  button: {
    backgroundColor: ORANGE,
    // marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#333", // or any "disabled" shade you prefer
  },
});
