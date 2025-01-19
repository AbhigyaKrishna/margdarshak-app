import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";


const PublicLayout = () => {
  return (
  
    <SafeAreaView style={{ flex: 1 }}>
    <StatusBar 
        backgroundColor="#F0F8FF" 
      />
    <Stack
      screenOptions={{
       headerShown:false
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
        }}
      ></Stack.Screen>

      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Register",
        }}
      ></Stack.Screen>

      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
        }}
      ></Stack.Screen>
    </Stack>
    </SafeAreaView>
  
  );
};

export default PublicLayout;