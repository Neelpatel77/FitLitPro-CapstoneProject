import React, { useState, useEffect } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import Slider from '@react-native-community/slider';

const WaterIntakeTracker = ({ navigation }) => {
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
    if (todayWater) {
      setWaterIntake(parseFloat(todayWater));
      setWaterPercentage(`${(parseFloat(todayWater) / 4 * 100).toFixed(0)}%`);
    }
    if (todaySleep) {
      setSleepDuration(parseFloat(todaySleep));
      setSleepPercentage(`${(parseFloat(todaySleep) / 8 * 100).toFixed(0)}%`);
    }
  };

  const saveData = async (type, value) => {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`@${type}_${today}`, value.toString());
    loadData(); // Reload data to update history
  };

  const handleWaterChange = (value) => {
    setWaterIntake(value);
    setWaterPercentage(`${(value / 4 * 100).toFixed(0)}%`);
    saveData('water', value);
  };

  const handleSleepChange = (value) => {
    setSleepDuration(value);
    setSleepPercentage(`${(value / 8 * 100).toFixed(0)}%`);
    saveData('sleep', value);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* ... Existing component layout ... */}

        <View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Water Tracker</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={4}
            value={waterIntake}
            onValueChange={handleWaterChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={[customStyles.trackerCircle, { width: 100, height: 100 }]}>
            <Text style={customStyles.trackerPercentage}>{waterPercentage}</Text>
          </View>
        </View>

        <View style={customStyles.trackerContainer}>
          <Text style={customStyles.trackerTitle}>Sleep Tracker</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={8}
            value={sleepDuration}
            onValueChange={handleSleepChange}
            minimumTrackTintColor="#007BFF"
            maximumTrackTintColor="#000000"
          />
          <View style={[customStyles.trackerCircle, { width: 100, height: 100 }]}>
            <Text style={customStyles.trackerPercentage}>{sleepPercentage}</Text>
          </View>
        </View>

        {/* ... Add components to display waterHistory and sleepHistory ... */}

      </ScrollView>
    </View>
  );
};

 
  
  // ... Other styles ...




const customStyles = StyleSheet.create({



  trackerCircle: {
    width: 100, // Adjusted width and height
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  
  // ... (Your existing styles)
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
  },
  trackerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  trackerPercentage: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WaterIntakeTracker;
