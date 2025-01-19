import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const PhilosopherList = () => {
  const router = useRouter();

  const philosophers = [
    {
      id: 1,
      name: "Osho",
      rate: "₹100/min",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5lNa6ZsvGpa5pJZPuDU4CkAdvA3UlYPLBehL_5NumqGMalFctMKiyYRM&s=10",
    },
    {
      id: 2,
      name: "J. Krishnamurthi",
      rate: "₹120/min",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA-u8GHM9Kxq_R3kqTlH650nvgpbz-DmsoAtsJoDp9S9v9JOoqvIGYNKIc&s=10",
    },
    {
      id: 3,
      name: "Alan Watts",
      rate: "₹90/min",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFUPO8omOEDNjDo18UlGT59KRtA-JutBt24Bdki1k9YlgBqf1IuZJGS0y&s=10",
    },
    {
      id: 4,
      name: "Sadhguru",
      rate: "₹110/min",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFhn_FL8mH84BsARqZA2XW5r5YsUrJdd8CAm182l4evjHr2WCXsjrnKw&s=10",
    },
  ];

  const handleChatPress = (philosopher: { id: number; name: string; rate: string }) => {
    router.push({
      pathname: "/chat",
      params: { 
        philosopherId: philosopher.id,
        philosopherName: philosopher.name,
        rate: philosopher.rate
      }
    });
  };

  const renderPhilosopher = ({ item }: { item: { id: number; name: string; rate: string; imageUrl: string } }) => (
    <View style={styles.card}>
      <View style={styles.ribbon}>
        <Text style={styles.ribbonText}>*Discount*</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.rate}>{item.rate}</Text>
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => handleChatPress(item)}
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Philosophers</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={philosophers}
        renderItem={renderPhilosopher}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c3e703",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    width: 150,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  ribbon: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  ribbonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 5,
  },
  rate: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: "#c3e703",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default PhilosopherList;
