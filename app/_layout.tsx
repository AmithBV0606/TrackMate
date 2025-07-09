import { AuthContextProvider, useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// SafeAreaProvider - To make our App's screen adaptive to abstructive areas like notch.

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // const isAuth = false;
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments(); // To know what screen the user is on.

  useEffect(() => {
    setTimeout(() => {
      const inAuthGroup = segments[0] === "auth";

      if (!user && !inAuthGroup && !isLoadingUser) {
        router.replace("/landing");
      } else if (user && inAuthGroup && !isLoadingUser) {
        router.replace("/");
      }
    }, 500);
  }, [user, segments, router, isLoadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111" }}>
      <AuthContextProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}
