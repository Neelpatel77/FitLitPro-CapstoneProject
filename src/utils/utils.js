// Implement any utility functions needed for the app
// For example, date formatting, data manipulation, etc.
// Here's a sample helper function for calculating daily progress
export const calculateDailyProgress = (activities) => {
  // Assuming activities is an array of objects with timestamps and duration
  const today = new Date().setHours(0, 0, 0, 0);
  const dailyActivities = activities.filter(
    (activity) => activity.timestamp >= today
  );
  const totalDuration = dailyActivities.reduce(
    (total, activity) => total + activity.duration,
    0
  );
  return totalDuration;
};

// You can add more utility functions here as needed
// For example, a function to format dates, calculate statistics, etc.
