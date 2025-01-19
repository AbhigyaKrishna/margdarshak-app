import { useAuth } from "@clerk/clerk-expo";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "components/TabBar";


export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar  backgroundColor="#F0F8FF" />
        
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              headerShown: false,
            }}
            redirect={!isSignedIn}
          />
          
           
           <Tabs.Screen
            name="chat"
            options={{
              headerShown: false,
            }}
            redirect={!isSignedIn}
          />
           <Tabs.Screen
            name="meditate"
            options={{
              headerShown: false,
            }}
            redirect={!isSignedIn}
          />
          <Tabs.Screen
            name="soothe"
            options={{
              headerShown: false,
            }}
            redirect={!isSignedIn}
          />

         
        </Tabs>
      </SafeAreaView>
   
  );
};

export default TabsPage;