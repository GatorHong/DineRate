import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';

const RestaurantItem = ({ restaurant, colors, styles, onPress }) => (
  <TouchableOpacity style={styles.restaurantListItem} onPress={onPress}>
    {restaurant.photo_url && (
      <Image
        source={{ uri: restaurant.photo_url }}
        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
      />
    )}
    <View style={{ flex: 1 }}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      {restaurant.rating && (
        <Text style={{ color: colors.text }}>⭐ {restaurant.rating}</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
  </TouchableOpacity>
);

export default function Home() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

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

  useEffect(() => {
    if (!token) return;

    const fetchNearbyRestaurants = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const res = await api.get('/google/nearby', {
          params: { lat: latitude, lng: longitude },
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurants(res.data);
      } catch (err) {
        setError('Failed to fetch nearby restaurants.');
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyRestaurants();
  }, [token]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Login');
  };

  const renderRestaurantItem = ({ item }) => (
    <RestaurantItem
      key={item.place_id}
      restaurant={item}
      colors={colors}
      styles={styles}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/(Home)/restaurant',
          params: { restaurant: JSON.stringify(item) },
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.title}>DineRate</Text>
          <TouchableOpacity
            style={[styles.buttonContainer, { paddingHorizontal: 15, marginTop: 0 }]}
            onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listHeader}>Nearby Restaurants</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.tint} />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : restaurants.length === 0 ? (
            <Text>No nearby restaurants found.</Text>
          ) : (
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={(item) => item.place_id}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
