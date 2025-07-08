import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();

  const router = useRouter();

  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all the fields!!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be atleast 6 characters long!!");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }

      router.replace("/");
    }
  };

  const handleSwtichMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const ORANGE = "#FF8800";
  const DARK_BG = "#111";
  const LIGHT_TEXT = "#fff";
  const ERROR_COLOR = "#FF4C4C";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DARK_BG,
      marginTop: -50,
    },
    content: {
      flex: 1,
      padding: 16,
      justifyContent: "center",
    },
    title: {
      textAlign: "center",
      marginBottom: 24,
      fontWeight: "600",
      color: LIGHT_TEXT,
    },
    input: {
      marginBottom: 16,
      backgroundColor: "#222",
    },
    button: {
      marginTop: 8,
      backgroundColor: ORANGE,
    },
    switchModeButton: {
      marginTop: 16,
    },
    errorText: {
      color: ERROR_COLOR,
      textAlign: "center",
      marginBottom: 8,
    },
    greetingMain: {
      color: ORANGE,
      fontWeight: "bold",
      fontSize: 32,
      textAlign: "left",
      marginBottom: 16,
    },
    greetingSub: {
      color: "#5C5C5C",
      fontWeight: "600",
      fontSize: 22,
      textAlign: "left",
      marginBottom: 8,
    },
    logo: {
      width: 220,
      height: 120,
      alignSelf: "center",
      marginTop: 8,
      marginBottom: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/TrackMate-Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ height: 24 }} />
        {isSignUp ? (
          <>
            <Text style={styles.greetingMain} variant="headlineLarge">
              {"Let's Get Started!!"}
            </Text>
            <Text style={styles.greetingSub}>
              {"Create your account to track your habits!"}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.greetingMain} variant="headlineLarge">
              {"Let's Sign You In!!"}
            </Text>
            <Text style={styles.greetingSub}>{"Welcome Back"}</Text>
            <Text style={styles.greetingSub}>{"You've been missed!"}</Text>
          </>
        )}
        <View style={{ height: 32 }} />

        <TextInput
          label={"Email"}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
          theme={{
            colors: {
              text: LIGHT_TEXT,
              placeholder: ORANGE,
              primary: ORANGE,
              background: "#222",
              surface: "#222",
            },
          }}
        />

        <TextInput
          label={"Password"}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          theme={{
            colors: {
              text: LIGHT_TEXT,
              placeholder: ORANGE,
              primary: ORANGE,
              background: "#222",
              surface: "#222",
            },
          }}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleAuth}
          labelStyle={{ color: "#000", fontWeight: "bold" }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button
          mode="text"
          onPress={handleSwtichMode}
          style={styles.switchModeButton}
          labelStyle={{ color: ORANGE }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
