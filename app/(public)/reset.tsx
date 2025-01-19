import { View, StyleSheet, TextInput, Button, Pressable, Text } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from "@expo/vector-icons/AntDesign";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  const onRequestReset = async () => {
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  const onReset = async () => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");

      await setActive!({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <View style={styles.inputContainer}>
            <Fontisto name="email" size={24} color="black" />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholder="Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <Pressable onPress={onRequestReset} style={styles.button}>
            <Text style={styles.buttonText}>Reset password</Text>
          </Pressable>
        </>
      )}

      {successfulCreation && (
        <>
          <View style={styles.inputContainer}>
            <MaterialIcons name="password" size={24} color="black" />
            <TextInput
              style={styles.textInput}
              value={code}
              placeholder="OTP"
              onChangeText={setCode}
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="lock" size={24} color="black" />
            <TextInput
              style={styles.textInput}
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <Pressable onPress={onReset} style={styles.button}>
            <Text style={styles.buttonText}>Set new Password</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  textInput: {
    marginLeft: 12,
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontWeight: "300",
  },
  button: {
    width: "100%",
    maxWidth: 300,
    marginTop: 16,
    backgroundColor: "#c3e703",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontSize: 18,
    fontWeight: "300",
  },
});

export default PwReset;
