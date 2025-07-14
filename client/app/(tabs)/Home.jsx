import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../../constants/Styles';
import api from '../../services/api';

export default function Home() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null); // ✅ track token state

  // Step 1: Load token first
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        router.replace('/Login');
        return;
      }
      setToken(storedToken); // ✅ set token before fetching
    };
    fetchToken();
  }, []);

  // Step 2: When token is ready, fetch restaurants
  useEffect(() => {
    if (!token) return; // wait for token to load

    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(res.data);
      } catch (err) {
        setError("Failed to fetch restaurants.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [token]); // 👈 only run when token is ready

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Login');
  };

  return (
      <View style={styles.screenContainer}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            🍽️ Nearby Restaurants
          </Text>

          {loading ? (
              <ActivityIndicator size="large" color={colors.tint} />
          ) : error ? (
              <Text style={{ color: "red" }}>{error}</Text>
          ) : (
              <ScrollView>
                {restaurants.map((restaurant) => (
                    <View key={restaurant._id} style={{
                      marginBottom: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      backgroundColor: colors.background
                    }}>
                      <Text style={{ ...styles.text, fontSize: 18, fontWeight: '600' }}>
                        {restaurant.name}
                      </Text>
                      <Text style={styles.text}>{restaurant.description}</Text>
                      <Text style={{ ...styles.text, fontStyle: 'italic' }}>{restaurant.location}</Text>
                    </View>
                ))}
              </ScrollView>
          )}
        </View>
      </View>
  );
}
