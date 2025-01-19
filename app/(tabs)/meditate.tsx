import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

interface Tutorial {
  id: string;
  title: string;
  duration: number; // in seconds
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  animationUrl: string;
  imageUrl?: string;
  completed: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Breathing Basics',
    duration: 300, // 5 minutes
    level: 'Beginner',
    description: 'Learn the fundamental breathing techniques for meditation.',
    instructions: [
      'Sit comfortably with your back straight',
      'Close your eyes gently',
      'Breathe in slowly through your nose for 4 counts',
      'Hold for 4 counts',
      'Exhale slowly through mouth for 6 counts',
      'Repeat the cycle'
    ],
    animationUrl: require('/assets/breathing.json'),
    completed: false
  },
  {
    id: '2',
    title: 'Mindfulness Practice',
    duration: 600, // 10 minutes
    level: 'Intermediate',
    description: 'Develop awareness of your thoughts and emotions.',
    instructions: [
      'Find a quiet place to sit',
      'Close your eyes and take a few deep breaths',
      'Focus on your breath and observe your thoughts',
      'Gently bring your focus back to your breath if your mind wanders',
      'Continue for the duration of the session'
    ],
    animationUrl: require('/assets/mindfulness.json'),
    completed: false
  },
  {
    id: '3',
    title: 'Deep Meditation',
    duration: 900, // 15 minutes
    level: 'Advanced',
    description: 'Advanced techniques for deep meditative states.',
    instructions: [
      'Sit in a comfortable position with your back straight',
      'Close your eyes and take a few deep breaths',
      'Focus on a mantra or a specific point in your mind',
      'Allow your mind to enter a deep state of relaxation',
      'Stay in this state for the duration of the session'
    ],
    animationUrl: require('/assets/deep.json'),
    completed: false
  },
];

enum ViewState {
  LIST = 'list',
  DETAIL = 'detail',
  SESSION = 'session'
}

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Ionicons name="arrow-back" size={24} color="#333" />
  </TouchableOpacity>
);

const SessionTimer = ({ duration, onComplete }: { duration: number; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <TouchableOpacity
        style={styles.timerButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color="#333"
        />
      </TouchableOpacity>
    </View>
  );
};

const MeditationTutorials = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LIST);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const handleBack = () => {
    switch (currentView) {
      case ViewState.LIST:
        router.back();
        break;
      case ViewState.DETAIL:
        setCurrentView(ViewState.LIST);
        break;
      case ViewState.SESSION:
        setCurrentView(ViewState.DETAIL);
        break;
    }
  };

  const renderTutorialList = () => (
    <View style={styles.viewContainer}>
      <BackButton onPress={handleBack} />
      <ScrollView style={styles.listContainer}>
        {tutorials.map(tutorial => (
          <TouchableOpacity
            key={tutorial.id}
            style={styles.tutorialCard}
            onPress={() => {
              setSelectedTutorial(tutorial);
              setCurrentView(ViewState.DETAIL);
            }}
          >
            <Text style={styles.cardTitle}>{tutorial.title}</Text>
            <Text style={styles.cardDuration}>{tutorial.duration / 60} minutes</Text>
            <Text style={styles.cardLevel}>{tutorial.level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTutorialDetail = () => (
    <View style={styles.viewContainer}>
      <BackButton onPress={handleBack} />
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>{selectedTutorial?.title}</Text>
        <Text style={styles.detailDescription}>{selectedTutorial?.description}</Text>
        
        <View style={styles.instructionsList}>
          {selectedTutorial?.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instructionItem}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setCurrentView(ViewState.SESSION)}
        >
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActiveSession = () => (
    <View style={styles.sessionContainer}>
      <BackButton onPress={handleBack} />
      <SessionTimer
        duration={selectedTutorial?.duration || 0}
        onComplete={() => {
          Alert.alert('Session Complete', 'Great job completing your meditation!');
          setCurrentView(ViewState.DETAIL);
        }}
      />
      <LottieView
        source={selectedTutorial?.animationUrl}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {currentView === ViewState.LIST && renderTutorialList()}
      {currentView === ViewState.DETAIL && renderTutorialDetail()}
      {currentView === ViewState.SESSION && renderActiveSession()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  listContainer: {
    padding: 16,
  },
  tutorialCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDuration: {
    fontSize: 14,
    color: '#666',
  },
  cardLevel: {
    fontSize: 14,
    color: '#c3e703',
    fontWeight: '500',
  },
  detailContainer: {
    flex: 1,
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
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  instructionsList: {
    marginBottom: 24,
  },
  instructionItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#c3e703',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sessionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  viewContainer: {
    flex: 1,
    paddingTop: 80,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timerButton: {
    backgroundColor: '#c3e703',
    padding: 16,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MeditationTutorials;