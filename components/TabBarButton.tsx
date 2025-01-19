import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { icon } from "constants/icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { GestureResponderEvent } from "react-native";

interface TabBarProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: keyof typeof icon;
  color: string;
  label: string;
}

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,

  label,
}: TabBarProps) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIConStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={animatedIConStyle}>
        {typeof icon[routeName] === 'function' && icon[routeName]()}
      </Animated.View>

      <Animated.Text
        style={[
          { color: isFocused ? "#673ab7" : "#222", fontSize: 12 },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center" 
  },
});