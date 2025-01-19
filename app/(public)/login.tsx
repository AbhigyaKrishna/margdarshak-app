import {  Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { useSignIn } from "@clerk/clerk-react";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

const login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Loading Spinner */}
      <Spinner visible={loading} />

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome to Maarg Darshak</Text>
      <Text style={styles.subtitleText}>
        Signup or login below to get some spiritual guidance in your life
      </Text>

      {/* Email Input */}

      <View style={styles.inputContainer}>
        <Fontisto name="email" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <AntDesign name="lock" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.linkContainer}>
        {/* Forgot Password Link */}
        <Link href="/reset" asChild>
          <Pressable style={styles.linkPressable}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </Pressable>
        </Link>

        {/* Create Account Link */}
        <Link href="/register" asChild>
          <Pressable style={styles.linkPressable}>
            <Text style={styles.linkText}>Create Account</Text>
          </Pressable>
        </Link>
      </View>

      {/* Login Button */}
      <Pressable
        onPress={onSignInPress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      {/* Terms and conditions */}
      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#4a4a4a",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#4a4a4a",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
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
  linkContainer: {
    width: "100%",
    maxWidth: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkPressable: {
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    color: "#4a4a4a",
    fontWeight: "300",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#c3e703",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontSize: 18,
    fontWeight: "300",
  },
  termsText: {
    fontSize: 14,
    color: "#7a7a7a",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "300",
  },
});

export default login;
