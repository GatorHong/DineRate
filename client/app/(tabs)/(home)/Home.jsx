import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';

const navigateToList = ({ list }) => {
  router.push({
    pathname: '/[logListType]/LogList',
    params: { logListType: list },
  });
};

// Restaurant Item Component
const RestaurantItem = ({ restaurant, colors, styles }) => (
  <TouchableOpacity style={styles.restaurantListItem}>
    <Text style={styles.restaurantName}>{restaurant.name}</Text>
    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
  </TouchableOpacity>
);

export default function Home() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // Load token first
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        router.replace('/Login');
        return;
      }
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  // When token is ready, fetch restaurants
  useEffect(() => {
    if (!token) return;

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
  }, [token]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Login');
  };

  const renderRestaurantItem = ({ item }) => (
    <RestaurantItem
      key={item._id}
      restaurant={item}
      colors={colors}
      styles={styles}
    />
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={{ flex: 1, padding: 24 }}>
        {/* Header with title and logout */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.title}>DineRate</Text>
          <TouchableOpacity
            style={[styles.buttonContainer, { paddingHorizontal: 15, marginTop: 0 }]}
            onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant List */}
        <View style={styles.listContainer}>
          <Text style={styles.listHeader}>Hot Restaurants</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.tint} />
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : (
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
