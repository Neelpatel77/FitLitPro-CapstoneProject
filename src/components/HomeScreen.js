import React, { useState, useEffect } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NutritionComponent from './NutritionComponent';

 

const HomeScreen = ({ navigation }) => {
  const scaleValue = new Animated.Value(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [waterPercentage, setWaterPercentage] = useState('0%');
  const [sleepPercentage, setSleepPercentage] = useState('0%');
  const [waterHistory, setWaterHistory] = useState([]);
  const [sleepHistory, setSleepHistory] = useState([]);

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
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

      if (storedWater) {
        newWaterHistory.push({ date: dateString, value: storedWater });
      }
      if (storedSleep) {
        newSleepHistory.push({ date: dateString, value: storedSleep });
      }
    }
    setWaterHistory(newWaterHistory);
    setSleepHistory(newSleepHistory);

    // Load today's data to display in the tracker
    const todayWater = await AsyncStorage.getItem(`@water_${today}`);
    const todaySleep = await AsyncStorage.getItem(`@sleep_${today}`);
// Inside the loadData function
if (todayWater) {
  const intake = parseFloat(todayWater).toFixed(2);
  setWaterIntake(intake);
  setWaterPercentage(`${(intake / 10 * 100).toFixed(0)}%`);
}
if (todaySleep) {
  const duration = parseFloat(todaySleep).toFixed(2);
  setSleepDuration(duration);
  setSleepPercentage(`${(duration / 24 * 100).toFixed(0)}%`);
}



const saveData = async (type, value) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    // Use toFixed(2) here if value is a number and you want to limit the decimal places
    await AsyncStorage.setItem(`@${type}_${today}`, String(parseFloat(value).toFixed(2)));
    loadData(); // Reload data to update history
  } catch (e) {
    // handle error
    console.error(e);
  }
};


// Update the handleWaterChange for the new maximum value of 10L
const handleWaterChange = (value) => {
  setWaterIntake(value);
  const percentage = (value / 10) * 100; // Calculate percentage based on 10L max
  setWaterPercentage(`${percentage > 100 ? 100 : percentage.toFixed(0)}%`); // Ensure it does not exceed 100%
  saveData('water', value);
};



// const handleSleepChange = (value) => {
//   setSleepDuration(value);
//   const percentage = (value / 24) * 100; // Calculate percentage based on 24hrs max
//   setSleepPercentage(`${percentage > 100 ? 100 : percentage.toFixed(0)}%`); // Ensure it does not exceed 100%
//   saveData('sleep', value);
// };

// Update the handleSleepChange for the new maximum value of 24 hours
const handleSleepChange = (value) => {
  setSleepDuration(value);
  setSleepPercentage(`${(value / 24 * 100).toFixed(0)}%`);
  saveData('sleep', value);
};

const renderHistoryItem = (item, index) => (
  <View key={index} style={customStyles.historyItem}>
    <Text style={customStyles.historyDate}>{item.date}</Text>
    {/* Use toFixed(2) to format the number to two decimal places */}
    <Text style={customStyles.historyValue}>{parseFloat(item.value).toFixed(2)}</Text>
  </View>
);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <View style={customStyles.headerContainer}>
        <Animated.Text style={[customStyles.header, { transform: [{ scale: scaleValue }] }]}>
          FitLit Pro by Neel Patel!
        </Animated.Text>
        <Text style={customStyles.subheader}>Your Fitness Dashboard</Text>
      </View>

      <View style={customStyles.sectionContainer}>
          <NutritionComponent />
        </View>

        
        {/* Water Tracker */}
        <View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Water Tracker (Max 10L)</Text>
          <Text style={customStyles.trackerInfo}>Current Intake: {waterIntake.toFixed(1)} Liters</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={0.1}
            value={waterIntake}
            onValueChange={handleWaterChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{waterPercentage}</Text>
          </View>
        </View>

{/* Sleep Tracker */}
<View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Sleep Tracker (Max 24hrs)</Text>
          <Text style={customStyles.trackerInfo}>Duration: {sleepDuration.toFixed(1)} hrs</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={24}
            step={0.1}
            value={sleepDuration}
            onValueChange={handleSleepChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{sleepPercentage}</Text>
          </View>
        </View>

{/* Water History Section */}
<View style={customStyles.historyContainer}>
          <Text style={customStyles.historyTitle}>Water Intake History</Text>
          {waterHistory.map(renderHistoryItem)}
        </View>

        {/* Sleep History Section */}
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
