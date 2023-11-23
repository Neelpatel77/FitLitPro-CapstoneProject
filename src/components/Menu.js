import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  const navigator = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const navigateTo = (screenName) => {
    if (screenName === 'Home') {
      navigator.reset({ routes: [{ name: 'Home' }] });
    } else {
      navigator.navigate('NavigationTabs', { screen: screenName });
    }
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
        <Text style={styles.iconText}>☰</Text>
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.options}>
          <TouchableOpacity onPress={() => navigateTo('Home')} style={styles.option}>
            <Text style={styles.optionText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('BMICalculator')} style={styles.option}>
            <Text style={styles.optionText}>BMI Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('Achievements')} style={styles.option}>
            <Text style={styles.optionText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('Progress')} style={styles.option}>
            <Text style={styles.optionText}>Progress Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('Todo')} style={styles.option}>
            <Text style={styles.optionText}>Todo List</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  icon: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 30,
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
  options: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 40,
    left: 0,
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  option: {
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 18,
  },
});

export default Menu;
