import React from "react";
import { View, Text } from "react-native";



import { Ionicons } from "@expo/vector-icons"; // Importing Ionicons


type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export const IconWithBadge = ({ name }: { name: IoniconsName }) => {
  


  return (
    <View style={{ position: "relative" }}>
      <Ionicons name={name} size={24} />
     
        <View
          style={{
            position: "absolute",
            right: -8,
            top: -8,
            backgroundColor: "red",
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        
        </View>
    
    </View>
  );
};

export const icon = {
  home: () => <Ionicons name="home-outline" size={24} />,
  chat : () => <Ionicons name="chatbox-ellipses-outline" size={24} />,
  meditate: () => <Ionicons name="medical-outline" size={24} />,
  Soothe: () => <Ionicons name="musical-notes" size={24} />,



};