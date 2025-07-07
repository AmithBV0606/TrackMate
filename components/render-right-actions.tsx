// To mark the habit as completed :

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function RenderRightActions() {
  return (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
});
