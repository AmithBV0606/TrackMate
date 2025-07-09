import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const ORANGE = "#FF8800";
const BLACK = "#201E1F";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: BLACK,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          position: "absolute",
        },
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: "#666666",
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-today"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-habit"
        options={{
          title: "Add Habit",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
