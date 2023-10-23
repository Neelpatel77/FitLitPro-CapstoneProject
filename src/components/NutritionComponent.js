import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NutritionComponent = () => {
  const [foodData, setFoodData] = useState(null);
  const [foodItem, setFoodItem] = useState(''); 
  const apiKey = 'SR4wOccLcocxfnaGpluh3Rlkvc7iSqMtTqcjUEIW';  

  useEffect(() => {
    if (foodItem) {
      fetchFoodData();
    }
  }, [foodItem]); 

  const fetchFoodData = async () => {
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItem}&api_key=${apiKey}`
      );
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        setFoodData(data.foods[0]);
      } else {
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
        placeholder="Enter a food item"
        value={foodItem}
        onChangeText={setFoodItem}
      />
      <Button title="Fetch Nutritional Info" onPress={fetchFoodData} />
      {foodData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{foodData.description}</Text>
          {foodData.foodNutrients && foodData.foodNutrients.length > 0 ? (
            <Text>
              Calories: {foodData.foodNutrients[0].value}{' '}
              {foodData.foodNutrients[0].unitName}
            </Text>
          ) : (
            <Text>No nutritional information available</Text>
          )}

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
