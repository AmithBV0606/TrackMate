import { useAuth } from "@/context/auth-context";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/profile"} style={styles.link}>
        Profile Page
      </Link>

      <Button
        mode="contained"
        onPress={signOut}
        icon={"logout"}
        style={{ marginTop: 10 }}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 10,
    color: "#28A1CC",
    textDecorationLine: "underline",
  },
});
