import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import ProgressTracker from './src/components/ProgressTracker';
import BMICalculatorScreen from './src/components/BMICalculator';
import NavigationStack from './src/components/NavigationStack';
const Stack = createStackNavigator();

const App = () => {
  return (
<NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
};

export default App;

