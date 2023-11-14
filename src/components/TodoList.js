import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';




//added firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc4xIj_02uYTR2ylwg-P7GlMUsF_aJN-I",
  authDomain: "sprint1-fitlitpro.firebaseapp.com",
  projectId: "sprint1-fitlitpro",
  storageBucket: "sprint1-fitlitpro.appspot.com",
  messagingSenderId: "490665347806",
  appId: "1:490665347806:web:fa2875073f40778c38504f",
  measurementId: "G-8ESTKNN0FV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TodoList = ({ addTaskToAchievement }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    loadTasksFromDatabase();
  }, []);

  const loadTasksFromDatabase = async () => {
    const data = [];
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    querySnapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setTasks(data);
  };

  const addTask = async () => {
    if (task.trim() !== '') {
      const newTask = { description: task, done: false };

      try {
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        newTask.id = docRef.id;
        setTasks([...tasks, newTask]);
        setTask('');
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  };

  const toggleTaskDone = async (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, done: !task.done };
      }
      return task;
    });

    try {
      await Promise.all(updatedTasks.map(async (task) => {
        await setDoc(doc(db, 'tasks', task.id), { done: task.done }, { merge: true });
      }));

      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const showDeleteConfirmationModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowDeleteConfirmation(true);
  };

  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', selectedTaskId));
      setTasks(tasks.filter((task) => task.id !== selectedTaskId));
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
  <FlatList
    ListHeaderComponent={
      <>
        <Text style={styles.header}>Fitness task List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={task}
            onChangeText={setTask}
            placeholder="Enter your task..."
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </>
    }
    data={tasks}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => toggleTaskDone(item.id)}
        style={styles.taskItem}
      >
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskText, item.done && styles.doneText]}>{item.description}</Text>
        </View>
        <TouchableOpacity onPress={() => showDeleteConfirmationModal(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )}
    ListFooterComponent={
      <Modal visible={showDeleteConfirmation} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
          <TouchableOpacity onPress={deleteTask} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDeleteConfirmation(false)} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    textDecorationLine: 'none',
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  deleteText: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },

  addToAchievementText: {
    color: 'green',
  },

});

export default TodoList;
