import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Load the saved username from AsyncStorage when the component mounts
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername !== null) {
        setUsername(savedUsername);
      }
    } catch (error) {
      setUsername("Player");
      console.error("Error loading username:", error);
    }
  };

  const handleUsernameChange = async () => {
    try {
      // Save the new username to AsyncStorage
      await AsyncStorage.setItem("username", username);
      console.log("Username saved:", username);
    } catch (error) {
      console.error("Error saving username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter new username"
        />
        <TouchableOpacity style={styles.button} onPress={handleUsernameChange}>
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
