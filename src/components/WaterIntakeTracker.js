import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const WaterIntakeTracker = () => {
  const [waterIntake, setWaterIntake] = useState('');

  const saveWaterIntake = () => {
    console.log(`Saved water intake: ${waterIntake} ml`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water Intake Tracker</Text>
      <TextInput
        style={styles.input}
        value={waterIntake}
        onChangeText={setWaterIntake}
        keyboardType="numeric"
        placeholder="Enter Water Intake (ml)"
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveWaterIntake}>
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

export default WaterIntakeTracker;
