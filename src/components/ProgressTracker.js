import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';
import { VictoryLabel } from 'victory-native';

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
    if (measurement.trim() === '' || value.trim() === '') {
      alert('Please fill in both fields.');
      return;
    }
    if (isNaN(value) || value.trim() === '') {
      alert('Please enter a valid number for the value.');
      return;
    }

    const newEntry = { date: selectedDate.getTime(), measurement, value: parseFloat(value) };
    setDataEntries([...dataEntries, newEntry]);
    setMeasurement('');
    setValue('');
  };

  const handleValueChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) { // Allows only numbers and decimal point
      setValue(text);
    } else {
      alert('Please enter only numbers for the value.');
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

  const handleMeasurementChange = (text) => {
    if (/^\d+$/.test(text)) { // Check if the text is a number
      alert('You cannot enter a number in this field.');
    } else {
      setMeasurement(text);
    }
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
              onChangeText={handleMeasurementChange}
              placeholder="Enter Measurement (e.g., Weight, Waist)"
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={handleValueChange}
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
            <ScrollView horizontal>
              <VictoryChart
                height={500}
                width={800}
                domainPadding={{ x: [30, 30], y: [0, 20] }}
                padding={{ top: 20, bottom: 50, left: 50, right: 50 }}
              >
                <VictoryLine
                  data={dataEntries.map(entry => {
                    const numericValue = parseFloat(entry.value);
                    return {
                      x: new Date(entry.date),
                      y: isNaN(numericValue) ? 0 : numericValue,
                      label: `${entry.measurement}: ${numericValue}` // This will label each point
                    };
                  })}
                  style={{
                    data: { stroke: "#c43a31" },
                    labels: { fill: "#c43a31", fontSize: 12, padding: 5 }
                  }}
                  labelComponent={<VictoryLabel dy={-10} />} // Adjust label position if necessary
                />

                <VictoryAxis
                  fixLabelOverlap={true}
                  style={{
                    axisLabel: { padding: 30 }
                  }}
                  tickFormat={(x) => `${new Date(x).toLocaleDateString()}`}
                />
              </VictoryChart>
            </ScrollView>


            <Text style={styles.buttonText1}>-- Progress Tracker --</Text>

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
  buttonText1: {
    color: '#000080',
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
