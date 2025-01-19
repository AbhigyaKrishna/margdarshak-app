import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { blogs } from '../data/blogs';
import { useRouter } from 'expo-router';
interface Blog {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  views: number;
  imageUrl: string;
}

const BlogList = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Only take first 2 blogs
      setBlogPosts(blogs.slice(0, 2));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
    router.push('/all-blogs');
  };

  const renderItem = ({ item }: { item: Blog }) => (
    <TouchableOpacity 
      style={styles.blogCard}
      onPress={() => router.push(`/blog-details?id=${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.blogImage} />
      <View style={styles.blogInfo}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogMeta}>
          {item.author} • {new Date(item.publishedAt).toDateString()}
        </Text>
        <Text style={styles.viewCount}>{item.views} views</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c3e703" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={blogPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity 
        style={styles.seeAllButton}
        onPress={() => console.log('No more blogs')}
      >
        <Text style={styles.seeAllText}>See All Blogs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  blogImage: {
    width: '100%',
    height: 200,
  },
  blogInfo: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  blogMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  viewCount: {
    fontSize: 12,
    color: '#888',
  },
  seeAllButton: {
    backgroundColor: '#c3e703',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default BlogList;
