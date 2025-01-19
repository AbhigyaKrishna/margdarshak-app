import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GemSuggestionResponse {
  success: boolean;
  data: {
    gemstone: string;
    benefits: string[];
    wear_instructions: string;
    suitability: string;
  };
}

const STATIC_USER_ID = "test";

const GemStone = () => {
  const [loading, setLoading] = useState(false);
  const [gemData, setGemData] = useState<GemSuggestionResponse['data'] | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchGemSuggestion();
  }, []);

  const fetchGemSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/horoscope/gem-suggestion?user_id=${STATIC_USER_ID}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: GemSuggestionResponse = await response.json();
      if (result.success) {
        setGemData(result.data);
      } else {
        throw new Error('Failed to fetch gem data');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to get gem suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Gemstone Recommendation</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#c3e703" style={styles.loader} />
      ) : gemData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.gemTitle}>Recommended Gemstone</Text>
          <Text style={styles.gemstone}>{gemData.gemstone}</Text>

          <Text style={styles.sectionTitle}>Benefits:</Text>
          {gemData.benefits.map((benefit, index) => (
            <Text key={index} style={styles.benefit}>• {benefit}</Text>
          ))}

          <Text style={styles.sectionTitle}>How to Wear:</Text>
          <Text style={styles.instructions}>{gemData.wear_instructions}</Text>

          <Text style={styles.sectionTitle}>Suitability:</Text>
          <Text style={styles.suitability}>{gemData.suitability}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gemTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  gemstone: {
    fontSize: 24,
    color: '#c3e703',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  benefit: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  suitability: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
  },
});

export default GemStone;