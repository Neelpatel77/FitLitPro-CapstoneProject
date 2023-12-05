import React, { useState, useEffect } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NutritionComponent from './NutritionComponent';

const HomeScreen = ({ navigation }) => {
  const scaleValue = new Animated.Value(0);
  const [waterIntake, setWaterIntake] = useState('0.000');
  const [sleepDuration, setSleepDuration] = useState('0.000');
  const [waterPercentage, setWaterPercentage] = useState('0.00%'); // Updated to show 2 decimal places
  const [sleepPercentage, setSleepPercentage] = useState('0.00%'); // Updated to show 2 decimal places
  const [waterHistory, setWaterHistory] = useState([]);
  const [sleepHistory, setSleepHistory] = useState([]);

  useEffect(() => {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
    loadData();
  }, []);

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0];
    let newWaterHistory = [];
    let newSleepHistory = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const storedWater = await AsyncStorage.getItem(`@water_${dateString}`);
      const storedSleep = await AsyncStorage.getItem(`@sleep_${dateString}`);
      if (storedWater) newWaterHistory.push({ date: dateString, value: storedWater });
      if (storedSleep) newSleepHistory.push({ date: dateString, value: storedSleep });
    }
    setWaterHistory(newWaterHistory);
    setSleepHistory(newSleepHistory);
    const todayWater = await AsyncStorage.getItem(`@water_${today}`);
    const todaySleep = await AsyncStorage.getItem(`@sleep_${today}`);
    if (todayWater) {
      setWaterIntake(todayWater);
      setWaterPercentage(`${(parseFloat(todayWater) / 10 * 100).toFixed(2)}%`); // Updated to show 2 decimal places
    }
    if (todaySleep) {
      setSleepDuration(todaySleep);
      setSleepPercentage(`${(parseFloat(todaySleep) / 24 * 100).toFixed(2)}%`); // Updated to show 2 decimal places
    }
  };

  const saveData = async (type, value) => {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`@${type}_${today}`, value.toString());
    loadData();
  };

  const handleWaterChange = value => {
    const formattedValue = parseFloat(value).toPrecision(4); // Limit precision to 3 decimal places
    setWaterIntake(formattedValue); // Store the string representation
    const percentage = (value / 10) * 100;
    setWaterPercentage(`${percentage > 100 ? 100 : percentage.toPrecision(2)}%`); // Updated to show 2 decimal places
    saveData('water', formattedValue);
  };
  
  const handleSleepChange = value => {
    const formattedValue = parseFloat(value).toPrecision(4); // Limit precision to 3 decimal places
    setSleepDuration(formattedValue); // Store the string representation
    const percentage = (value / 24) * 100;
    setSleepPercentage(`${percentage > 100 ? 100 : percentage.toPrecision(2)}%`); // Updated to show 2 decimal places
    saveData('sleep', formattedValue);
  };

  const renderHistoryItem = (item, index) => (
    <View key={index} style={customStyles.historyItem}>
      <Text style={customStyles.historyDate}>{item.date}</Text>
      <Text style={customStyles.historyValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={customStyles.headerContainer}>
          <Animated.Text style={[customStyles.header, { transform: [{ scale: scaleValue }] }]}>FitLit Pro by Neel Patel!</Animated.Text>
          <Text style={customStyles.subheader}>Your Fitness Dashboard</Text>
        </View>
        <View style={customStyles.sectionContainer}>
          <NutritionComponent />
        </View>

        {/* Water Tracker Section */}
        <View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Water Tracker (Max 10L)</Text>
          <Text style={customStyles.trackerInfo}>
            Current Intake: {waterIntake} Liters
          </Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={0.001}
            value={parseFloat(waterIntake)}
            onValueChange={handleWaterChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{waterPercentage}</Text>
          </View>
        </View>

        {/* Sleep Tracker Section */}
        <View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Sleep Tracker (Max 24hrs)</Text>
          <Text style={customStyles.trackerInfo}>
            Duration: {sleepDuration} hrs
          </Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={24}
            step={0.001}
            value={parseFloat(sleepDuration)}
            onValueChange={handleSleepChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{sleepPercentage}</Text>
          </View>
        </View>

        <View style={customStyles.historyContainer}>
          <Text style={customStyles.historyTitle}>Water Intake History</Text>
          {waterHistory.map(renderHistoryItem)}
        </View>
        <View style={customStyles.historyContainer}>
          <Text style={customStyles.historyTitle}>Sleep Duration History</Text>
          {sleepHistory.map(renderHistoryItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const customStyles = StyleSheet.create({
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 16,
    color: '#666',
  },
  historyValue: {
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trackerContainer: {
    marginBottom: 30,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  trackerCircle: {
    width: 100, // Adjusted width and height
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  trackerPercentage: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
