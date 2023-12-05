import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BodyMassIndexCalculator = () => {
  const [bodyWeight, setBodyWeight] = useState('');
  const [bodyHeight, setBodyHeight] = useState('');
  const [bmiResult, setBmiResult] = useState('');

  const calculateBMI = () => {
    if (!bodyWeight || !bodyHeight) {
      alert('Please enter both weight and height.');
      return;
    }
  
    const weightInKg = parseFloat(bodyWeight);
    const heightInM = parseFloat(bodyHeight) / 100;
  
    // Check for division by zero
    if (weightInKg === 0 || heightInM === 0) {
      alert("Math error: Can't divide by zero.");
      return;
    }
  
    const calculatedBMI = weightInKg / (heightInM * heightInM);
    const calculatedBMIRounded = calculatedBMI.toFixed(2);
    setBmiResult(calculatedBMIRounded);
  
    const newBMIData = {
      weight: weightInKg,
      height: heightInM,
      bmi: calculatedBMIRounded,
      timestamp: new Date().toString(),
    };
    saveBMIData(newBMIData);
  };
  
  const saveBMIData = async (data) => {
    try {
      const savedData = await AsyncStorage.getItem('bmiData');
      const existingData = savedData ? JSON.parse(savedData) : [];
      existingData.push(data);
      await AsyncStorage.setItem('bmiData', JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const clearBMIData = async () => {
    try {
      await AsyncStorage.removeItem('bmiData');
      setBodyWeight('');
      setBodyHeight('');
      setBmiResult('');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };
  useEffect(() => {
    loadBMIData();
  }, []);


  const loadBMIData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('bmiData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length > 0) {
          const latestData = parsedData[parsedData.length - 1];
          setBodyWeight(latestData.weight.toString());
          setBodyHeight((latestData.height * 100).toString());
          setBmiResult(latestData.bmi);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };




  return (
    <View style={styles.container}>
      <Text style={styles.header}>Body Mass Index Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={bodyWeight}
        onChangeText={(text) => setBodyWeight(text)}
        keyboardType="numeric"
      />




      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={bodyHeight}
        onChangeText={(text) => setBodyHeight(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      {bmiResult ? (
        <Text style={styles.result}>Your BMI: {bmiResult}</Text>
      ) : null}
      <TouchableOpacity style={styles.clearButton} onPress={clearBMIData}>
        <Text style={styles.buttonText}>Clear Data</Text>
      </TouchableOpacity>
    </View>
  );
};






const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 16,
  },


  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  calculateButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BodyMassIndexCalculator;
