import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SleepTracker = () => {
  const [hoursOfSleep, setHoursOfSleep] = useState('');

  const saveSleepData = () => {
    // Implement logic to save sleep data
    // For example, you can use AsyncStorage or send it to a server
    console.log(`Saved hours of sleep: ${hoursOfSleep}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Tracker</Text>
      <TextInput
        style={styles.input}
        value={hoursOfSleep}
        onChangeText={setHoursOfSleep}
        keyboardType="numeric"
        placeholder="Enter Hours of Sleep"
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveSleepData}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SleepTracker;
