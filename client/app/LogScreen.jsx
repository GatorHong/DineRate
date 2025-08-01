import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import api from '../services/api';

export default function LogScreen() {
  const { colors, styles } = useThemeStyles();
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [food, setFood] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [token, setToken] = useState(null);
  const [visibility, setVisibility] = useState('Public'); // NEW

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        router.replace('/Login');
        return;
      }
      setToken(storedToken);
    };
    loadToken();
  }, []);

  const handleSave = async () => {
    try {
      if (!token) return;

      if (!location.trim()) {
        alert('Please select a restaurant before submitting.');
        return;
      }

      const payload = { title, description, location, food, visibility }; // include visibility
      console.log('📤 Sending log payload:', payload);

      const response = await api.post('/logs', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Log saved:', response.data);
      router.replace('/(tabs)/(home)/Home');
    } catch (err) {
      console.error('❌ Error saving log:', err.response?.data || err.message);
    }
  };

  const handleClose = () => router.back();

  const handleSearch = async (query) => {
    setLocation(query);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await api.get('/google/search', {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data || []);
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setTitle(item.name || '');
    setLocation(item.address || '');
    setPhotoUrl(item.photo_url || '');
    setRating(item.rating || null);
    setSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.actionButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.emphasisButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Log a Meal</Text>

        <View style={styles.formSection}>
          <Text style={styles.formSectionHeader}>Info</Text>

          {/* Restaurant Search */}
          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Restaurant</Text>
              <TextInput
                style={styles.formFieldInput}
                placeholder="Start typing..."
                placeholderTextColor={colors.icon}
                value={location}
                onChangeText={handleSearch}
              />
            </View>
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSuggestionSelect(item)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      padding: 10,
                      backgroundColor: colors.sectionBackground,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    {item.photo_url && (
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: colors.border,
                        }}
                      >
                        <Image
                          source={{ uri: item.photo_url }}
                          style={{ width: 50, height: 50 }}
                          resizeMode="cover"
                        />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: colors.text, fontSize: 12 }}>
                        {item.address}
                      </Text>
                      {item.rating && (
                        <Text style={{ color: colors.text, fontSize: 12 }}>
                          ⭐ {item.rating}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={{ borderRadius: 8, marginTop: 4 }}
              />
            )}
          </View>

          {/* Food */}
          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Food</Text>
              <TextInput
                style={styles.formFieldInput}
                placeholder="Enter Food"
                placeholderTextColor={colors.icon}
                value={food}
                onChangeText={setFood}
              />
            </View>
          </View>

          {/* Visibility */}
          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Visibility</Text>
              <TouchableOpacity
                onPress={() => {
                  const options = ['Public', 'Private', 'Friend'];
                  const currentIndex = options.indexOf(visibility);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setVisibility(options[nextIndex]);
                }}
                style={{
                  flex: 1,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: colors.cardBackground,
                }}
              >
                <Text style={{ color: colors.text }}>{visibility}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Log Section */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionHeader}>Log</Text>
          <View style={localStyles(colors).logContainer}>
            <View style={styles.formField}>
              <View style={styles.formFieldRow}>
                <Text style={styles.formFieldLabel}>Title</Text>
                <TextInput
                  style={styles.formFieldInput}
                  placeholder="Optional"
                  placeholderTextColor={colors.icon}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={localStyles(colors).descriptionContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Enter your thoughts and description here..."
                placeholderTextColor={colors.icon}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const localStyles = (colors) =>
  StyleSheet.create({
    logContainer: {
      backgroundColor: colors.sectionBackground,
      borderRadius: 10,
      overflow: 'hidden',
    },
    descriptionContainer: {
      padding: 16,
    },
  });
