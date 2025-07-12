import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../services/api";
import {useThemeStyles} from "@/constants/Styles";

export default function Register() {
  const styles = useThemeStyles();
  const [form, setForm] = useState({ name: "", username: "", password: "" });

  const handleNameChange = (text) => setForm({ ...form, name: text });
  const handleUsernameChange = (text) => setForm({ ...form, username: text });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("token", res.data.token);
      Alert.alert("Success", "✅ Registration successful!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={form.name}
          onChangeText={handleNameChange}
      />
      <TextInput
          style={styles.input}
          placeholder="Username"
          value={form.username}
          onChangeText={handleUsernameChange}
      />
      <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={handlePasswordChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
