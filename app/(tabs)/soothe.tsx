import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SootheSounds: React.FC = () => {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(false);

  const sounds = [
    { id: '1', name: 'Meditate Music', uri: require('assets/audio/meditation.mp3') },
    { id: '2', name: 'Relax', uri: require('assets/audio/relax.mp3') },
    { id: '3', name: 'Rainfall', uri: require('assets/audio/meditation.mp3') },
  ];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const playSound = async (uri: any, name: string) => {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        uri,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setCurrentSound(name);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading sound:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const onVolumeChange = async (value: number) => {
    if (sound) {
      await sound.setVolumeAsync(value);
      setVolume(value);
    }
  };

  const renderItem = ({ item }: { item: typeof sounds[0] }) => (
    <TouchableOpacity
      style={[
        styles.soundItem,
        currentSound === item.name && styles.activeSoundItem
      ]}
      onPress={() => playSound(item.uri, item.name)}
    >
      <Ionicons 
        name={item.id === '1' ? 'medkit-outline' : item.id === '2' ? 'cloud-outline' : 'rainy-outline'} 
        size={32} 
        color="#fff" 
      />
      <Text style={styles.soundName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('assets/logo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Soothe Sounds</Text>
        <FlatList
          data={sounds}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />

        {currentSound && (
          <View style={styles.playerCard}>
            <Text style={styles.nowPlaying}>Now Playing: {currentSound}</Text>
            
            <View style={styles.progressContainer}>
              <Text style={styles.time}>{formatTime(position)}</Text>
              <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={onSliderValueChange}
                minimumTrackTintColor="#c3e703"
                maximumTrackTintColor="#000000"
              />
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={togglePlayPause}
                disabled={isLoading}
              >
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={50}
                  color="#c3e703"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
              <Ionicons name="volume-low" size={24} color="black" />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={onVolumeChange}
                minimumTrackTintColor="#c3e703"
                maximumTrackTintColor="#000000"
              />
              <Ionicons name="volume-high" size={24} color="black" />
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  title: {
    
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    
  },
  list: {
    width: '100%',
    paddingHorizontal: 16,
  },
  listContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  soundItem: {
    width: 150,
    height: 100,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#c3e703',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  activeSoundItem: {
    backgroundColor: '#a3c703',
    transform: [{ scale: 1.05 }],
  },
  soundName: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  playerCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 60,
  },
  nowPlaying: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 10,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    marginHorizontal: 20,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default SootheSounds;
