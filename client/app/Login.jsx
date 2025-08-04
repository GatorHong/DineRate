import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const { styles, colors } = useThemeStyles();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleUsernameChange = (text) => setForm({ ...form, username: text.toLowerCase() });
  const handlePasswordChange = (text) => setForm({ ...form, password: text });

  const animateSuccess = () => {
    // Reset animations
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);

    // Start animations
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // Store both token and user info
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Logged in as:", user.role);

      // Set user in context with token attached
      setUser({ ...user, token });

      // Show success animation
      setShowSuccess(true);
      animateSuccess();

      // Navigate after animation completes
      setTimeout(() => {
        router.replace("/(tabs)/Home");
      }, 1500); // Wait for animation to finish

    } catch (err) {
      setIsLoading(false);
      const message = err?.response?.data?.message || "❌ Login failed";
      setErrorMessage(message);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {showSuccess ? (
        <View style={localStyles.successOverlay}>
          <Animated.View
            style={[
              localStyles.successCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                backgroundColor: colors.buttonBackground,
              }
            ]}
          >
            <Ionicons name="checkmark" size={50} color="#fff" />
          </Animated.View>
          <Animated.Text
            style={[
              styles.text,
              localStyles.successText,
              { opacity: opacityAnim }
            ]}
          >
            Login Successful
          </Animated.Text>
        </View>
      ) : (
        <>
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
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.icon}
            secureTextEntry
            value={form.password}
            onChangeText={handlePasswordChange}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, isLoading && localStyles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>
        </>
      )}
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
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  }
});