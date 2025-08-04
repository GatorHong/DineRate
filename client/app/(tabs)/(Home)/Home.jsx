import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
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
  }, [router]);

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

  // Custom header component for the FlatList
  const ListHeaderComponent = () => (
    <View style={{ paddingTop: 16, paddingLeft: 16 }}>
      <Text style={styles.listHeader}>Nearby Restaurants</Text>
    </View>
  );

  // Empty state or loading components
  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      );
    }

    if (restaurants.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No nearby restaurants found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.place_id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={ListHeaderComponent}
        contentInsetAdjustmentBehavior="automatic"
      />
    );
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { paddingTop: 0}]}>
      <View style={{ flex: 1, paddingHorizontal : 12 }}>
        {renderContent()}
        {!loading && !error && restaurants.length > 0 && (
          <LinearGradient
            colors={[
              `${colors.background}00`,
              `${colors.background}70`,
              colors.background
            ]}
            locations={[0, 0.5, 0.85]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              zIndex: 100,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}