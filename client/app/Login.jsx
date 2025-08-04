import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const { styles, colors } = useThemeStyles();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleUsernameChange = (text) => setForm({ ...form, username: text.toLowerCase() });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const handleSubmit = async () => {
    setErrorMessage("");

    try {
      const res = await api.post("/auth/login", form);

      // ✅ Log role
      console.log(`✅ Logged in as ${res.data.user.role}`);

      // ✅ Save token
      await AsyncStorage.setItem("token", res.data.token);

      // ✅ Save user in context
      setUser({
        ...res.data.user,
        token: res.data.token,
      });

      router.replace("/(tabs)/Home");
    } catch (err) {
      const message = err?.response?.data?.message || "❌ Login failed";
      setErrorMessage(message);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Login</Text>

      {errorMessage !== "" && (
        <View style={localStyles.errorContainer}>
          <Ionicons name="warning-outline" size={18} color="red" style={{ marginRight: 6 }} />
          <Text style={localStyles.errorText}>{errorMessage}</Text>
        </View>
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

const localStyles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffdddd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
  },
});
