import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NutritionComponent = () => {
  const [foodData, setFoodData] = useState(null);
  const [foodItem, setFoodItem] = useState('');
  const apiKey = 'SR4wOccLcocxfnaGpluh3Rlkvc7iSqMtTqcjUEIW';

  const findCalories = (nutrients) => {
    const calorieNutrient = nutrients.find(
      (nutrient) =>
        nutrient.nutrientId === 1008 || nutrient.nutrientName.toLowerCase() === 'energy'
    );
    return calorieNutrient;
  };

  const fetchFoodData = async () => {
    try {
      if (!foodItem) {
        // Clear food data when search bar is empty
        setFoodData(null);
        return;
      }

      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItem}&api_key=${apiKey}`
      );
      const data = await response.json();

      if (data.foods && data.foods.length > 0) {
        // Ensure the retrieved data corresponds to the correct food item
        const matchingFoodItem = data.foods.find(food => food.description.toLowerCase() === foodItem.toLowerCase());
        
        if (matchingFoodItem) {
          const calorieNutrient = findCalories(matchingFoodItem.foodNutrients);
          if (calorieNutrient) {
            const caloriesInKcal = calorieNutrient.value;
            setFoodData({ ...matchingFoodItem, calories: caloriesInKcal });
          } else {
            setFoodData({ ...matchingFoodItem, calories: 'N/A' });
          }
        } else {
          // Clear food data when no exact matching food item is found
          setFoodData(null);
        }
      } else {
        // Clear food data when no matching food item is found
        setFoodData(null);
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a food item (e.g. 'apple')"
        value={foodItem}
        onChangeText={setFoodItem}
      />
      <Button title="Fetch Nutritional Info" onPress={fetchFoodData} />
      {foodData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{foodData.description}</Text>
          <Text>
            Calories: {foodData.calories} kcal
          </Text>
          <Text>
            Serving Size: {foodData.servingSize} {foodData.servingSizeUnit}
          </Text>
        </View>
      ) : (
        <Text>Enter a value / Please enter a valid food name</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Set a neutral background color for the container
  },

  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5, // Optional: Add rounded corners to the input field
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#4CAF50', // Use a more soothing color like green
    alignItems: 'center',
    padding: 15, // Add padding for better spacing
    borderRadius: 5, // Optional: Add rounded corners
    marginTop: 20,
  },
  foodName: {
    fontSize: 18,
    color: '#ffffff', // White color for better contrast on the green background
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Add a new style for the button
  button: {
    backgroundColor: '#2196F3', // A pleasant blue color for the button
    color: '#ffffff', // White color text for the button
  },
  buttonText: {
    color: '#ffffff', // Ensure button text is white for better readability
  },
});

export default NutritionComponent;
