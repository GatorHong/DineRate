import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../../constants/Styles';
import api from '../../services/api';

export default function Profile() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Landing');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.screenContainer}>
        <Text style={[styles.text, { color: 'red' }]}>Failed to load profile.</Text>
        <TouchableOpacity onPress={handleLogout} style={[styles.buttonContainer, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Ionicons name="person-circle-outline" size={100} color={colors.icon} />
        <Text style={[styles.title, { marginTop: 10 }]}>{user.name || 'No Name'}</Text>
        <Text style={styles.text}>{user.email}</Text>
      </View>

      <View style={{ marginTop: 40, paddingHorizontal: 24 }}>
        <Text style={styles.subtitle}>Account Details</Text>
        <Text style={styles.text}>Email: {user.email}</Text>
        <Text style={styles.text}>User ID: {user._id}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={[styles.buttonContainer, { marginTop: 40 }]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
