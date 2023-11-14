import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';

import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressTracker = () => {
  const [dataEntries, setDataEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [measurement, setMeasurement] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@progressData');
        if (storedData !== null) {
          setDataEntries(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@progressData', JSON.stringify(dataEntries));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [dataEntries]);

  const saveEntry = () => {
    if (measurement.trim() !== '' && value.trim() !== '') {
      const newEntry = { date: selectedDate.getTime(), measurement, value };
      setDataEntries([...dataEntries, newEntry]);
      setMeasurement('');
      setValue('');
    }
  };

  const deleteEntry = (index) => {
    const updatedEntries = dataEntries.filter((_, i) => i !== index);
    setDataEntries(updatedEntries);
  };

  const chartData = {
    labels: dataEntries.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        data: dataEntries.map((entry) => {
          const value = parseFloat(entry.value);
          return isNaN(value) || !isFinite(value) ? 0 : value; 
        }),
      },
    ],
  };
  

  return (
<KeyboardAvoidingView style={styles.container} behavior="padding">
  <FlatList
    ListHeaderComponent={
      <>
        <Text style={styles.header}>Progress Tracker</Text>
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => setSelectedDate(date || selectedDate)}
          />
        </View>
        <TextInput
          style={styles.input}
          value={measurement}
          onChangeText={setMeasurement}
          placeholder="Enter Measurement (e.g., Weight, Waist)"
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          placeholder="Enter Value"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveEntry}
        >
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
      </>
    }
    data={dataEntries}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item, index }) => (
      <View style={styles.dataEntry}>
        <Text>{new Date(item.date).toLocaleDateString()} - {item.measurement}: {item.value}</Text>
        <TouchableOpacity onPress={() => deleteEntry(index)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    )}
    ListFooterComponent={
      <View style={styles.chartContainer}>
  <VictoryChart>
    <VictoryLine
      data={dataEntries.map((entry) => {
        // Convert value to a number and check if it's a valid number
        const numericValue = parseFloat(entry.value);
        return {
          x: new Date(entry.date),
          y: isNaN(numericValue) ? 0 : numericValue, // Use 0 or any other default for invalid numbers
        };
      })}
      style={{
        data: { stroke: "#c43a31" }
      }}
    />
    <VictoryAxis
      fixLabelOverlap={true}
      style={{
        axisLabel: { padding: 30 }
      }}
      tickFormat={(x) => `${new Date(x).toLocaleDateString()}`}
    />
  </VictoryChart>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.buttonText}>Back to Home</Text>
  </TouchableOpacity>
</View>

    }
  />
</KeyboardAvoidingView>

  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePicker: {
    width: 200,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  dataEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  deleteText: {
    color: 'red',
  },
  chartContainer: {
    marginTop: 20,
  },
  backButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ProgressTracker;
