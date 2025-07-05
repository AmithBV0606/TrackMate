import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = false;

  useEffect(() => {
    setTimeout(() => {
      if (!isAuth) {
        router.replace("/auth");
      } else {
        router.replace("/");
      }
    }, 500);
  });

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RouteGuard>
  );
}
