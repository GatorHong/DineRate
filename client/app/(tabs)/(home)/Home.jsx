import AsyncStorage from '@react-native-async-storage/async-storage';
import {router, useRouter} from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, FlatList, Text, View, SafeAreaView, Platform } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';
import Ionicons from '@expo/vector-icons/Ionicons';

const navigateToList = ({list}) => {
  router.push({
    pathname: '/[logListType]',
    params: {logListType : list },
  });
};

// Restaurant Item Component
const RestaurantItem = ({ restaurant, colors, styles }) => (
    <TouchableOpacity style={styles.restaurantItem}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.icon} />
    </TouchableOpacity>
);

// Tracking List Card Component
const TrackingListCard = ({ iconName, label, count, style, colors, styles }) => (
    <TouchableOpacity style={[styles.card, style]} onPress={() => navigateToList({list : label})}>
      <View style={styles.cardIconContainer}>
        <Ionicons name={iconName} size={28} color={colors.text} />
        <Text style={styles.cardLabel}>{label}</Text>
      </View>
      <Text style={styles.cardCount}>{count}</Text>
    </TouchableOpacity>
);

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
        <View style={{
          flex: 1,
          padding: 24
        }}>
          {/* Header with title and logout */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.title}>DineRate</Text>
            <TouchableOpacity
                style={[styles.buttonContainer, { paddingHorizontal: 15, marginTop: 0 }]}
                onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Restaurant List*/}
          <View style={ styles.listContainer}>
            <Text style={styles.listHeader}>Hot Restaurants</Text>
            {loading ? (
                <ActivityIndicator size="large" color={colors.tint}/>
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

          {/* Dashboard Cards at bottom */}
          <View style={[styles.dashboardContainer]}>
            {/* Top row of cards */}
            <View style={[styles.cardRow, { flex: 1 }]}>
              <TrackingListCard
                  iconName="bookmark"
                  label="To Visit"
                  count={6}
                  style={{ marginRight: 8 }}
                  colors={colors}
                  styles={styles}
              />
              <TrackingListCard
                  iconName="time"
                  label="In Progress"
                  count={2}
                  style={{ marginLeft: 8}}
                  colors={colors}
                  styles={styles}
              />
            </View>
            {/* Bottom card */}
            <TrackingListCard
                iconName="checkmark-circle"
                label="Completed"
                count={3}
                colors={colors}
                style={{flex : 0.5}}
                styles={styles}
            />
          </View>
        </View>
      </SafeAreaView>
  );
}
