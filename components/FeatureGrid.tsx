import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Feature {
  icon: string;
  label: string;
}

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const router = useRouter();

  const handlePress = (label: string) => {
    if (label === 'Daily Horoscope') {
      router.push('/HoroScope');
    } else if (label === 'GemStone') {
        router.push('/GemStone');
    } else if (label === 'Palm Reader') {
        router.push('/PalmReader');
    }
  };

  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <TouchableOpacity key={index} style={styles.feature} onPress={() => handlePress(feature.label)}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name={feature.icon} size={24} color="black" />
          </View>
          <Text style={styles.label}>{feature.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  feature: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#c3e703',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    gap: 10,
    color: '#000',
    textAlign: 'center',
  },
});

export default FeatureGrid;
