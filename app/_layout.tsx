import { AuthContextProvider, useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // const isAuth = false;
  const { user } = useAuth();
  const segments = useSegments(); // To know what screen the user is on.

  useEffect(() => {
    setTimeout(() => {
      const inAuthGroup = segments[0] === "auth";

      if (!user && !inAuthGroup) {
        router.replace("/auth");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, 500);
  }, [user, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </RouteGuard>
    </AuthContextProvider>
  );
}
