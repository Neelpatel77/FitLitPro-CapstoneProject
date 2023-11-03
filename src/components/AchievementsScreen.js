import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, Animated, Alert } from 'react-native';
import { ProgressBar } from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AchievementsScreen = ({ route }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [totalRedeemPoints, setTotalRedeemPoints] = useState(0);
  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));

  const accomplishments = [
   ];

  const pointMilestones = [
    { points: 50, title: 'Points will be deducted per redeem' },
    { points: 50, title: 'is the minimum balance required to redeem' },

   ];

  const fitnessActivities = [
    { id: 'running', name: 'Running', points: 20 },
    { id: 'yoga', name: 'Yoga', points: 15 },
    { id: 'cycling', name: 'Cycling', points: 25 },
    { id: 'weightlifting', name: 'Weightlifting', points: 20 },
    { id: 'jump_rope', name: 'Jump Rope', points: 15 },
    { id: 'hiking', name: 'Hiking', points: 25 },
    { id: 'dancing', name: 'Dancing', points: 15 },
    ];
  

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [completedTasks, userScore, totalRedeemPoints]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsedData = JSON.parse(data);
        setUserScore(parsedData.userScore);
        setTotalRedeemPoints(parsedData.totalRedeemPoints || 0);
        setCompletedTasks(parsedData.completedTasks);
      }
    } catch (error) {
      console.error('Error loading user data', error);
    }
  };

  const saveData = async () => {
    const userData = JSON.stringify({ userScore, totalRedeemPoints, completedTasks });
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  const resetData = () => {
    Alert.alert(
      'Reset Points',
      'Are you sure you want to reset your points to 0?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            setUserScore(0);
            setTotalRedeemPoints(0);
            setCompletedTasks([]);
            AsyncStorage.removeItem('userData');
          },
        },
      ],
    );
  };

  const addCompletedTask = (taskId) => {
    const task = route.params.tasks.find((task) => task.id === taskId);
    if (task) {
      setCompletedTasks([...completedTasks, task]);
      setUserScore(userScore + task.points);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setAnimationValue(new Animated.Value(0));
      });
    }
  };

  const earnFitnessPoints = (points) => {
    setUserScore(userScore + points);
  };

  const renderAchievementItem = ({ item }) => (
    <TouchableOpacity
      style={styles.achievementItem}
      onPress={() => setSelectedAchievement(item)}
    >
     </TouchableOpacity>
  );

  const renderFitnessActivity = ({ item }) => (
    <TouchableOpacity
      style={styles.fitnessActivity}
      onPress={() => earnFitnessPoints(item.points)}
    >
      <Text style={styles.activityText}>{item.name}</Text>
      <Text style={styles.pointsText}>Earn {item.points} points</Text>
    </TouchableOpacity>
  );

  const redeemReward = (rewardPoints) => {
    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem your points for ${rewardPoints} points?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            if (userScore >= rewardPoints) {
              setUserScore(userScore - rewardPoints);
              setTotalRedeemPoints(totalRedeemPoints + rewardPoints);
              alert('Reward redeemed! Enjoy your prize!');
            } else {
              alert('Not enough points to redeem this reward.');
            }
          },
        },
      ],
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Achievements</Text>
      <FlatList
        data={[...accomplishments, ...completedTasks]}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

 
      <FlatList
        data={fitnessActivities}
        renderItem={renderFitnessActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      

     
      <View style={styles.pointsContainer}>
        <Animated.Text style={[styles.pointsText, { color: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['black', 'green'],
        }) }]}>
          Your Points: {userScore}
        </Animated.Text>

         <View style={styles.milestonesContainer}>
          {pointMilestones.map((milestone, index) => (
            <Text key={index} style={styles.milestoneText}>
              {` ${milestone.points}  ${milestone.title}`}
            </Text>
          ))}
        </View>

        <Button
          title="Redeem Reward"
          onPress={() => redeemReward(50)}
        />
      </View>

       <Button
        title="Reset Points"
        onPress={resetData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementItem: {
   },
  fitnessActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 5,
  },
  activityText: {
    fontSize: 16,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  milestonesContainer: {
    marginVertical: 10,
  },
  milestoneText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default AchievementsScreen;
