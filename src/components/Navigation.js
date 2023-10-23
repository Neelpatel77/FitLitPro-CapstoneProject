import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ProgressTracker from './ProgressTracker';
import BMICalculatorScreen from './BMICalculator';
import TodoList from './TodoList'; // If you have a 'TodoList' screen

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProgressTracker" component={ProgressTracker} />
        <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} />
        <Stack.Screen name="TodoList" component={TodoList} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
