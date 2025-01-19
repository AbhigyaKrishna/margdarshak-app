import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token", err);
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inTabsGroup = segments[0] === "(tabs)";
    if (isSignedIn && !inTabsGroup) {
      router.replace("/home" as any);
    } else if (!isSignedIn) {
      router.replace("/login" as any);
    }

  }, [isSignedIn]);

  return <Slot />;
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
    <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayoutNav;