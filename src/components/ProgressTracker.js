import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';
import { VictoryLabel } from 'victory-native';
import { Picker } from '@react-native-picker/picker';


import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressTracker = () => {
  const [dataEntries, setDataEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [measurement, setMeasurement] = useState('');
  const [value, setValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');


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


  const processChartData = (dataEntries) => {
    // Create an object to hold the processed data, with dates as keys
    const groupedByDate = {};
  
    dataEntries.forEach((entry) => {
      const dateStr = new Date(entry.date).toLocaleDateString();
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      // Add the entry to the array for this date
      groupedByDate[dateStr].push(entry);
    });
  
    // Now convert the object back into an array suitable for the chart
    const processedData = Object.keys(groupedByDate).map((date) => {
      const entries = groupedByDate[date];
      // You can aggregate the values here if needed, for example by summing them
      const aggregateValue = entries.reduce((sum, entry) => sum + entry.value, 0);
      return { date: new Date(date), value: aggregateValue };
    });
  
    return processedData;
  };
  
 
  const getUniqueDates = (dataEntries) => {
    const uniqueDates = [];
    const uniqueTimestamps = new Set(); // To keep track of dates we've already seen
  
    dataEntries.forEach((entry) => {
      const dateStr = new Date(entry.date).toLocaleDateString();
      if (!uniqueTimestamps.has(dateStr)) {
        uniqueDates.push(new Date(entry.date)); // Add the unique date to the array
        uniqueTimestamps.add(dateStr); // Remember this date string
      }
    });
  
    return uniqueDates;
  };
  

  const processedDataEntries = processChartData(dataEntries);
  const uniqueDates = getUniqueDates(dataEntries);
  

  const saveEntry = () => {
    if (measurement.trim() === '' || value.trim() === '' || selectedUnit === '') {
      alert('Please fill in all fields and select a unit.');
      return;
    }
    if (isNaN(value)) {
      alert('Please enter a valid number for the value.');
      return;
    }
    if (selectedUnit === '') {
      alert('Please select the measurement unit between cm and kg.');
      return;
    }

    const newEntry = {
      date: selectedDate.getTime(),
      measurement,
      value: parseFloat(value),
      unit: selectedUnit, // Include the selected unit
    };
    setDataEntries([...dataEntries, newEntry]);
    setMeasurement('');
    setValue('');
    setSelectedUnit(''); // Reset the unit selection
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
              placeholder="Enter Measurement (e.g., Weight)"
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={handleValueChange}
              keyboardType="numeric"
              placeholder="Enter Value"
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Unit:</Text>




              <Picker
                selectedValue={selectedUnit}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setSelectedUnit(itemValue)}
                itemStyle={styles.itemStyle} // Apply the style here
              >
                <Picker.Item label="Please select a unit" value="" />
                <Picker.Item label="Kilograms (kg)" value="kg" />
                <Picker.Item label="Centimeters (cm)" value="cm" />
              </Picker>

            </View>

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
            <Text>{`${new Date(item.date).toLocaleDateString()} - ${item.measurement} (${item.unit}) - ${item.value}`}</Text>
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
                domain={{ y: [0, 300] }} // Set the domain for y-axis

                padding={{ top: 20, bottom: 50, left: 80, right: 80 }} // Increase left and right padding
              >


                <VictoryLine
                  data={dataEntries.map(entry => {
                    const numericValue = parseFloat(entry.value);
                    return {
                      x: new Date(entry.date),
                      y: isNaN(numericValue) ? 0 : numericValue,
                      label: `${entry.measurement} (${entry.unit}) - ${numericValue}`, // Include unit in label
                    };
                  })}
                  style={{
                    data: { stroke: "#c43a31" },
                    labels: { fill: "#4c4c4c", fontSize: 12, padding: 5 }
                  }}
                  labelComponent={
                    <VictoryLabel
                      dy={(datum) => (datum.index === 0 ? -15 : datum.index === dataEntries.length - 1 ? 15 : -10)}
                    />
                  }

                />
                <VictoryAxis
                  fixLabelOverlap={true}
                  style={{
                    tickLabels: { fill: "#333", fontSize: 14, padding: 5 }, // Updated style for tick labels on dependent axis
                    axisLabel: { padding: 30 },
                    grid: { stroke: '#c8d6e5', strokeWidth: 0.25 }
                  }}
                  // Only show tick marks and labels for dates that have data
                  tickValues={dataEntries.map(entry => new Date(entry.date))}
                  tickFormat={(x) => `${new Date(x).toLocaleDateString()}`}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: { fill: "#006400", fontSize: 12, padding: 5 }, // Apply the dark green color here
                    axisLabel: { padding: 30 }
                  }}
                  tickFormat={(t) => t % 1 === 0 ? t : ''} // Only show integer ticks
                  tickValues={[10, 35, 60, 85, 110, 135, 160, 185, 210, 235]}

                />
                <VictoryAxis
  fixLabelOverlap={true}
  style={{
    tickLabels: { fill: "#333", fontSize: 14, padding: 5 },
    axisLabel: { padding: 30 },
    grid: { stroke: '#c8d6e5', strokeWidth: 0.25 }
  }}
  tickValues={uniqueDates} // Use the unique dates for the tickValues
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePicker: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20, // Add space at the bottom of the chart
  },
  picker: {
    flex: 1,
    height: 40,
  },
  itemStyle: { // Define a separate style for the picker items
    fontSize: 14, // Set your desired font size for picker items here
  },

  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 120,

  },

  pickerLabel: {
    marginTop: 30,
    fontSize: 15,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 10,
    fontSize: 10,
    marginBottom: 90,
  },
});

export default ProgressTracker;