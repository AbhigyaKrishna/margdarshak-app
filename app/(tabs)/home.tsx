import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Alert,
  Text,
} from "react-native";
import { useRefresh } from "hooks/useRefresh";
import FeatureGrid from "components/FeatureGrid";
import BlogList from "components/BlogList";
import PhilosopherList from "components/PhilosopherList";
import RemedyList from "components/RemedyList";

const Home = () => {
  const { refreshing, handleRefresh } = useRefresh({
    onRefresh: async () => {
      Alert.alert("Refreshed!");
    },
  });

  

  const features = [
    { icon: "sun", label: "Daily Horoscope" },
    { icon: "hands", label: "Palm Reader" },
    { icon: "blog", label: "Astrology Blog" },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View>
        <FeatureGrid features={features} />
      </View>
      <View style={styles.section}>
        <BlogList />
      </View>
      <View style={styles.section}>
        <PhilosopherList />
      </View>
      {/* <View style={styles.section}>
        <RemedyList />
      </View> */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by The StrawHats at Level Supermind</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    marginBottom: 9,
  },
  section: {
    marginTop: 5,
    marginBottom: 15,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F8FF',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    fontWeight: 'bold',
  },
});

export default Home;
