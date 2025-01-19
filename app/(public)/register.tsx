import * as React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert(
        "Registration Error",
        err.errors?.[0]?.message || "An error occurred during registration",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert(
        "Verification Error",
        err.errors?.[0]?.message || "An error occurred during verification",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
        <Text style={styles.title}>Verify your email</Text>
        <View style={styles.inputContainer}>
          <AntDesign name="mail" size={24} color="black" />
          <TextInput
            style={styles.textInput}
            value={code}
            placeholder="Enter verification code"
            onChangeText={setCode}
          />
        </View>
        <Pressable style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>Verify Email</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          value={firstName}
          placeholder="First Name"
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          value={lastName}
          placeholder="Last Name"
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          value={emailAddress}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmailAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="lock" size={24} color="black" />
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <Pressable style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  textInput: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  button: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#c3e703',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    fontWeight: '300',
  },
});
