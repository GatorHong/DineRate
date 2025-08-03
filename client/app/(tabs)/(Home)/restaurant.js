import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useThemeStyles } from '../../../constants/Styles';

export default function RestaurantDetail() {
  const { styles } = useThemeStyles(); 
  const { restaurant } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);

  const handleAddToDine = async () => {
  if (!token) {
    Alert.alert('Error', 'You must be logged in to add to your list.');
    return;
  }

  try {
    await axios.post(
      'http://localhost:5000/api/logs',
      {
        title: data.name,
        location: data.location || data.address,
        photoUrl: data.photo_url,
        rating: data.rating || 0,
        logType: 'To Dine',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Alert.alert('Success', 'Restaurant added to your To-Dine list!');
  } catch (err) {
    console.error('❌ Failed to add to To-Dine:', err.message);
    Alert.alert('Error', 'Could not add to list. Please try again.');
  }
};



  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (restaurant) {
      try {
        const parsed = JSON.parse(restaurant);
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse restaurant:', e);
      }
    }
  }, [restaurant]);

  if (!data) return <Text style={{ padding: 20, color: '#000' }}>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      {data.photo_url && (
        <Image
          source={{ uri: data.photo_url }}
          style={{ height: 200, borderRadius: 10, marginBottom: 16 }}
        />
      )}

      <Text style={localStyles.name}>{data.name}</Text>

      <Text style={localStyles.detail}>
        📍 {data.location || data.address}
      </Text>

      {data.rating && (
        <Text style={localStyles.detail}>
          ⭐ {data.rating} / 5
        </Text>
      )}

      <Text style={localStyles.detail}>
        {data.description || "No description available."}
      </Text>

      {data.place_id && (
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 20 }]}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query_place_id=${data.place_id}`
            )
          }
        >
          <Text style={styles.buttonText}>🧭 Get Directions</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
  style={[styles.buttonContainer, { marginTop: 10, backgroundColor: 'green' }]}
  onPress={handleAddToDine}
>
  <Text style={styles.buttonText}>➕ Add to To-Dine</Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  detail: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 12,
  },
});
