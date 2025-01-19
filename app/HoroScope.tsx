import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface HoroscopeData {
  date: string;
  horoscope_data: string;
}

interface ApiResponse {
  data: HoroscopeData;
  status: number;
  success: boolean;
}

interface MonthlyHoroscopeData {
  date: string;
  monthly_horoscope: string;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const TIME_PERIODS = ['TODAY', 'TOMORROW', 'YESTERDAY'];

const ZodiacSelector = ({ selectedSign, onSelectSign }: { selectedSign: string, onSelectSign: (sign: string) => void }) => (
  <View style={styles.signsContainer}>
    {ZODIAC_SIGNS.map((sign) => (
      <TouchableOpacity
        key={sign}
        style={[
          styles.signButton,
          selectedSign === sign && styles.selectedSign
        ]}
        onPress={() => onSelectSign(sign)}
      >
        <Text style={[
          styles.signText,
          selectedSign === sign && styles.selectedSignText
        ]}>
          {sign}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const TabSelector = ({ viewType, onChangeView }: { viewType: 'daily' | 'monthly', onChangeView: (view: 'daily' | 'monthly') => void }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity 
      style={[styles.tab, viewType === 'daily' && styles.activeTab]}
      onPress={() => onChangeView('daily')}
    >
      <Text style={styles.tabText}>Daily</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.tab, viewType === 'monthly' && styles.activeTab]}
      onPress={() => onChangeView('monthly')}
    >
      <Text style={styles.tabText}>Monthly</Text>
    </TouchableOpacity>
  </View>
);

interface MonthlyViewProps {
  selectedSign: string;
  loading: boolean;
  onFetch: () => void;
  monthlyHoroscope: MonthlyHoroscopeData | null;
}

const MonthlyView = ({ selectedSign, loading, onFetch, monthlyHoroscope }: MonthlyViewProps) => (
  <View style={styles.monthlyContainer}>
    <TouchableOpacity
      style={[styles.fetchButton, !selectedSign && styles.disabledButton]}
      onPress={onFetch}
      disabled={!selectedSign || loading}
    >
      <Text style={styles.fetchButtonText}>
        {loading ? 'Loading...' : 'Get Monthly Horoscope'}
      </Text>
    </TouchableOpacity>

    {loading && (
      <ActivityIndicator size="large" color="#c3e703" style={styles.loader} />
    )}

    {monthlyHoroscope && (
      <View style={styles.resultContainer}>
        <Text style={styles.resultDate}>{monthlyHoroscope.date}</Text>
        <Text style={styles.horoscopeText}>{monthlyHoroscope.monthly_horoscope}</Text>
      </View>
    )}
  </View>
);

const HoroscopePage = () => {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState('');
  const [selectedDay, setSelectedDay] = useState('TODAY');
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [monthlyHoroscope, setMonthlyHoroscope] = useState<MonthlyHoroscopeData | null>(null);

  const fetchHoroscope = async () => {
    if (!selectedSign) {
      Alert.alert('Error', 'Please select a zodiac sign');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/horoscope/daily?sign=${selectedSign}&day=${selectedDay}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: ApiResponse = await response.json();
      if (result.success) {
        setHoroscope(result.data);
      } else {
        throw new Error('Failed to fetch horoscope');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Failed to fetch horoscope. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyHoroscope = async () => {
    if (!selectedSign) {
      Alert.alert('Error', 'Please select a zodiac sign');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/horoscope/monthly?sign=${selectedSign}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMonthlyHoroscope(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch monthly horoscope');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView: 'daily' | 'monthly') => {
    setViewType(newView);
    if (selectedSign) {
      newView === 'daily' ? fetchHoroscope() : fetchMonthlyHoroscope();
    }
  };

  const handleMonthlyFetch = async () => {
    if (!selectedSign) {
      Alert.alert('Error', 'Please select a zodiac sign');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/horoscope/monthly?sign=${encodeURIComponent(selectedSign)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setMonthlyHoroscope(result.data);
      } else {
        throw new Error('Failed to fetch horoscope');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch monthly horoscope');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Horoscope</Text>

      <TabSelector viewType={viewType} onChangeView={handleViewChange} />
      <ZodiacSelector selectedSign={selectedSign} onSelectSign={setSelectedSign} />

      {viewType === 'daily' ? (
        <ScrollView style={styles.container}>
          <View style={styles.timeContainer}>
            {TIME_PERIODS.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.selectedDay
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDay === day && styles.selectedDayText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.fetchButton}
            onPress={fetchHoroscope}
            disabled={loading}
          >
            <Text style={styles.fetchButtonText}>
              {loading ? 'Loading...' : 'Get Horoscope'}
            </Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#c3e703" style={styles.loader} />
          ) : horoscope && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultDate}>{horoscope.date}</Text>
              <Text style={styles.horoscopeText}>{horoscope.horoscope_data}</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.container}>
          <MonthlyView
            selectedSign={selectedSign}
            loading={loading}
            onFetch={handleMonthlyFetch}
            monthlyHoroscope={monthlyHoroscope}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60, // Increased to accommodate back button
    marginTop: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  signsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  signButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 90,
    alignItems: 'center',
    margin: 5,
  },
  selectedSign: {
    backgroundColor: '#c3e703',
    borderColor: '#c3e703',
  },
  signText: {
    fontSize: 16,
  },
  selectedSignText: {
    color: '#000',
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#c3e703',
    borderColor: '#c3e703',
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayText: {
    color: '#000',
    fontWeight: '500',
  },
  fetchButton: {
    backgroundColor: '#c3e703',
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: 'center',
  },
  fetchButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  loader: {
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  resultDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#c3e703',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  monthlyContainer: {
    padding: 16,
  },
  monthlyDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  monthlyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
export default HoroscopePage;
