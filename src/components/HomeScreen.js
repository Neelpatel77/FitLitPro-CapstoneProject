import React, { useState, useEffect } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import NutritionComponent from './NutritionComponent'; 

const HomeScreen = ({ navigation }) => {
  const scaleValue = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToTrackers = () => {
    navigation.navigate('Trackers');
  };

  const [waterPercentage, setWaterPercentage] = useState('70%');
  const [sleepPercentage, setSleepPercentage] = useState('85%');

  const waterPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPercentage = Math.max(0, Math.min(100, gestureState.moveY / 1.5));
      setWaterPercentage(newPercentage.toFixed(0) + '%');
    },
  });

  const sleepPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPercentage = Math.max(0, Math.min(100, gestureState.moveY / 1.5));
      setSleepPercentage(newPercentage.toFixed(0) + '%');
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={customStyles.headerContainer}>
          <Animated.Text style={[customStyles.header, { transform: [{ scale: scaleValue }] }]}>
            FitLit Pro by Neel Patel!
          </Animated.Text>
          <Text style={customStyles.subheader}>Your Fitness Dashboard</Text>
        </View>

        <TouchableOpacity style={customStyles.trackersButton} onPress={navigateToTrackers}>
          <Text style={customStyles.trackersButtonText}>Trackers</Text>
        </TouchableOpacity>

        <View style={customStyles.sectionContainer}>
          <View style={customStyles.sectionHeader}>
            <Text style={customStyles.sectionTitle}>Nutrition Information</Text>
          </View>
          <NutritionComponent />
        </View>

        <View style={customStyles.trackerContainer} {...waterPanResponder.panHandlers}>
          <Text style={customStyles.trackerTitle}>Water Tracker</Text>
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{waterPercentage}</Text>
          </View>
        </View>

        <View style={customStyles.trackerContainer} {...sleepPanResponder.panHandlers}>
          <Text style={customStyles.trackerTitle}>Sleep Tracker</Text>
          <View style={customStyles.trackerCircle}>
            <Text style={customStyles.trackerPercentage}>{sleepPercentage}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const customStyles = StyleSheet.create({
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
  trackersButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  trackersButtonText: {
    color: 'white',
    fontSize: 16,
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

export default HomeScreen;
