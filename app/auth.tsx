import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  const handleSwtichMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineLarge">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <TextInput
          label={"Email"}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label={"Password"}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />

        <Button mode="contained" style={styles.button}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button
          mode="text"
          onPress={handleSwtichMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: -50
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: 600,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
