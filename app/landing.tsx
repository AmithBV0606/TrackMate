import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const ORANGE = "#FF8800";
const BLACK = "#111";
const LIGHT_TEXT = "#fff";
const SUB_TEXT = "#B0B0B0";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/TrackMate-Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Your daily{" "}
          <Text style={{ color: ORANGE, fontWeight: "bold" }}>Boost</Text>, to
          better{" "}
          <Text style={{ color: ORANGE, fontWeight: "bold" }}>Habits</Text>!
        </Text>

        <Text style={styles.subtitle}>
          Track your habits, take control of your life.{"\n"}Stay consistent,
          Stay confident!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/auth")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <RNText style={styles.terms}>
          Note : By clicking Continue button, you are agreeing to our{" "}
          <RNText style={{ color: ORANGE }}>Terms & Condition</RNText>
        </RNText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 200,
    marginBottom: 16,
  },
  logo: {
    width: 320,
    height: 200,
  },
  card: {
    width: "100%",
    backgroundColor: "#2A2B2A",
    borderTopColor: ORANGE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  title: {
    color: LIGHT_TEXT,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: SUB_TEXT,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 24,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: BLACK,
    fontWeight: "bold",
    fontSize: 18,
  },
  terms: {
    color: SUB_TEXT,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
});
