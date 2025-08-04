import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {router, useLocalSearchParams, useNavigation} from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';

export default function RestaurantDetail() {
  const { styles, colors } = useThemeStyles();
  const { restaurant } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const navigation = useNavigation();

  // Load user token
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
    };
    fetchToken();
  }, []);


  // Parse restaurant data
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

  useEffect(() => {
    navigation.setOptions({
      title: 'Restaurant Details',
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.subScreenHeaderBackground,
        }
    });
  }, [navigation]);

  if (!token) return <Text style={[styles.text, { padding: 20 }]}>Loading user...</Text>;
  if (!data) return <Text style={[styles.text, { padding: 20 }]}>Loading...</Text>;


  const handleAddToDine = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to add to your list.');
      return;
    }

    const payload = {
      title: data.name,
      location: data.location || data.address,
      photoUrl: data.photo_url,
      rating: data.rating || 0,
      logType: 'To Dine',
    };

    console.log('📦 To-Dine Payload:', payload);

    try {
      setIsSubmitting(true);

      await axios.post('http://localhost:5000/api/logs', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ To-Dine log created successfully');

      Alert.alert(
          'Success',
          'Restaurant added to your To-Dine list!',
          [
            {
              text: 'OK',
              onPress: () => {
                router.push({ pathname: '/(tabs)/Profile', params: { refresh: 'true' } });
              },
            },
          ]
      );
    } catch (err) {
      console.error('❌ Add to To-Dine failed:', err.response?.data || err.message);
      Alert.alert('Error', 'Could not add to list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollEnabled = contentHeight > containerHeight && containerHeight > 0;

  return (
      <SafeAreaView style={[styles.screenContainer]}>
        <ScrollView
            style={{ backgroundColor: colors.subScreenBackground }}
            contentContainerStyle={{ padding: 20 }}
            scrollEnabled={scrollEnabled}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setContainerHeight(height);
            }}
            onContentSizeChange={(width, height) => {
              setContentHeight(height);
            }}
        >

          {/* Restaurant Image */}
          {data.photo_url && (
              <Image
                  source={{ uri: data.photo_url }}
                  style={{ height: 200, borderRadius: 10, marginBottom: 16 }}
              />
          )}

          <Text style={styles.title}>{data.name}</Text>

          <Text style={[styles.text, { marginTop: 8, fontWeight: '600' }]}>
            📍 {data.location || data.address}
          </Text>

          {data.rating && (
              <Text style={[styles.text, { marginTop: 8, fontWeight: '600' }]}>
                ⭐ {data.rating} / 5
              </Text>
          )}

          <Text style={[styles.text, { marginTop: 8, fontWeight: '600' }]}>
            {data.description || 'No description available.'}
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
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
          )}

          <TouchableOpacity
              disabled={isSubmitting}
              style={[
                styles.buttonContainer,
                { marginTop: 24, backgroundColor: isSubmitting ? '#555' : '#2e7d32' }
              ]}
              onPress={handleAddToDine}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Adding...' : 'Add to To-Dine'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  );
}
