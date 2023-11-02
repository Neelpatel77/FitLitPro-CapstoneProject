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
        placeholder="Enter a food item (e.g., 'apple', 'pizza', 'chicken')"
        value={foodItem}
        onChangeText={setFoodItem}
      />
      <Text style={styles.infoText}>The calories are for 100gms Portion</Text>
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
        <Text>No data</Text>
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
  },

  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default NutritionComponent;
