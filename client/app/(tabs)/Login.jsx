import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from "../../services/api";
import { useThemeStyles } from '../../constants/Styles';

export default function Login() {
  const { styles, colors } = useThemeStyles();
  const [form, setForm] = useState({ username: "", password: "" });
  const navigation = useNavigation();

  const handleUsernameChange = (text) => setForm({ ...form, username: text });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      await AsyncStorage.setItem("token", res.data.token);
      Alert.alert("Success", "✅ Login successful!");
      navigation.navigate("Home"); // 👈 redirect after login
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
      <View style={styles.screenContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.icon}
              value={form.username}
              onChangeText={handleUsernameChange}
          />
          <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.icon}
              secureTextEntry
              value={form.password}
              onChangeText={handlePasswordChange}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
      </View>
  );
}
