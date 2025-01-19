import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PalmReader = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <WebView
        source={{ uri: "https://www.yeschat.ai/i/gpts-2OToEghsFo-Palm-Reader-Pro-v2" }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: "#fff",
    marginVertical: 50
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  webview: {
    flex: 1,
    marginTop: 70
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    marginBottom: 50,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PalmReader;
