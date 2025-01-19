import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity,Alert } from "react-native";
import { useRouter } from "expo-router";

const RemedyList = () => {
  const router = useRouter();

  const remedies = [
    {
      id: 1,
      title: "Pooja",
      imageUrl: "https://5.imimg.com/data5/SELLER/Default/2022/9/FL/VN/EP/121039764/western-astrology-services-250x250.jpg",
    },
    {
      id: 2,
      title: "Healing",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY8UvnSOrbgf5ypUI5ZJF8jQ3JJvErdxXqTw&usqp=CAU",
    },
    {
      id: 3,
      title: "Hand Reading",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9argbvsVYg4743BqPNZlR54yswa_pxQ9FbtwcS8KoZkYoUtYZaoyPBI8&s=10",
    },
    {
      id: 4,
      title: "Meditation Guide",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY8UvnSOrbgf5ypUI5ZJF8jQ3JJvErdxXqTw&usqp=CAU",
    },
    {
      id: 5,
      title: "Future Prediction",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRoPUQMpX1cKOuB0RThpdzW43Tkjagnd3ZNhNhtpVyy184oi4OT-G1jazN&s=10",
    },
  ];

  const handlePress = (title: string) => {
    if (title === "Hand Reading") {
      router.push("/PalmReader");
    } else {
      Alert.alert("Feature not available", `The ${title} feature is not yet implemented.`);
    }
  };

  const renderRemedy = ({ item }: { item: { id: number; title: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.title)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home Remedy</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={remedies}
        renderItem={renderRemedy}
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
    overflow: "hidden",
    marginRight: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RemedyList;
