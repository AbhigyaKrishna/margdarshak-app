import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";
import { useSearchParams } from "expo-router/build/hooks";

const BlogDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  interface Blog {
    imageUrl: string;
    title: string;
    author: string;
    publishedAt: string;
    content: string;
  }

  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(
        `https://meditation-api.herokuapp.com/blogs/${id}`
      );
      setBlog(response.data.blog);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  if (!blog) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: blog.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.meta}>
        {blog.author} • {new Date(blog.publishedAt).toDateString()}
      </Text>
      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
});

export default BlogDetails;
