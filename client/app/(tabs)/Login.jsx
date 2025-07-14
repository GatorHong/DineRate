import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from "../../services/api";
import { useThemeStyles } from '../../constants/Styles';

export default function Login() {
  const { styles, colors } = useThemeStyles();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleUsernameChange = (text) => setForm({ ...form, username: text });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await api.post("/auth/login", form);
      await AsyncStorage.setItem("token", res.data.token);
      navigation.navigate("Home");
    } catch (err) {
      const message = err?.response?.data?.message || "❌ Login failed";
      setErrorMessage(message);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Login</Text>

      {errorMessage !== "" && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

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
