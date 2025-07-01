import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../services/api";
import {useThemeStyles} from "@/constants/Styles";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleUsernameChange = (text) => setForm({ ...form, username: text });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      await AsyncStorage.setItem("token", res.data.token);
      Alert.alert("Success", "✅ Login successful!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
      <View>
        <Text>Login</Text>
        <TextInput
            placeholder="Username"
            value={form.username}
            onChangeText={handleUsernameChange}
        />
        <TextInput
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={handlePasswordChange}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
  );
}
