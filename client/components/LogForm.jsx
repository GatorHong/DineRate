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
  View
} from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import api from '../services/api';
import ConfirmModal from './ConfirmModal';

function ToggleButton({ options, value, onChange, colors }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor:
              value === option ? colors.buttonBackground : colors.sectionBackground,
          }}
          onPress={() => onChange(option)}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: value === option ? 'bold' : 'normal',
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function LogForm({
  mode = 'create',
  initialData = {},
  logId,
  onSaved,
  onCancel,
}) {
  const isEdit = mode === 'edit';
  const { colors, styles } = useThemeStyles();

  const [token, setToken] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [food, setFood] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [logType, setLogType] = useState('Dined');

  useEffect(() => {
    const load = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        router.replace('/Login');
        return;
      }
      setToken(storedToken);

      if (isEdit && initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setLocation(initialData.location || '');
        setFood(initialData.food || '');
        setPhotoUrl(initialData.photoUrl || '');
        setRating(initialData.rating ?? null);
        setVisibility(initialData.visibility || 'Public');
        setLogType(initialData.logType || 'Dined');
      }
    };
    load();
  }, [isEdit, initialData?._id]);

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
    setRating(item.rating ?? null);
    setSuggestions([]);
  };

const handleSubmit = async () => {
  try {
    if (!token) return;
    if (!location.trim()) {
      alert('Please select a restaurant before submitting.');
      return;
    }

    const payload = {
      title,
      description,
      location,
      food,
      visibility,
      logType,
      photoUrl,
      rating,
    };

    const resp = isEdit
      ? await api.put(`/logs/${logId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : await api.post('/logs', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

    router.replace({ pathname: '/(tabs)/Profile', params: { refresh: 'true' } }); // ✅ Redirect with refresh
  } catch (err) {
    console.error('❌ Save failed:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Save failed. Please try again.');
  }
};

const confirmDelete = async () => {
  try {
    await api.delete(`/logs/${logId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowConfirm(false);
    router.push({ pathname: '/(tabs)/Profile', params: { refresh: 'true' } }); // ✅ Redirect with refresh
  } catch (err) {
    console.error('❌ Error deleting log:', err.message);
    alert(err.response?.data?.message || 'Delete failed.');
  }
};


  const handleDelete = () => {
    setShowConfirm(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.actionButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.emphasisButton}>{isEdit ? 'Save' : 'Done'}</Text>
        </TouchableOpacity>
        {isEdit && (
          <TouchableOpacity onPress={handleDelete}>
            <Text style={[styles.actionButton, { color: 'red' }]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{isEdit ? 'Edit Log' : 'Log a Meal'}</Text>

        {/* Info Section */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionHeader}>Info</Text>

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
                      <Text style={{ color: colors.text, fontSize: 12 }}>{item.address}</Text>
                      {item.rating && (
                        <Text style={{ color: colors.text, fontSize: 12 }}>⭐ {item.rating}</Text>
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

          {/* Category */}
          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Category</Text>
              <ToggleButton
                options={['Dined', 'To Dine']}
                value={logType}
                onChange={setLogType}
                colors={colors}
              />
            </View>
          </View>

          {/* Visibility */}
          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Visibility</Text>
              <ToggleButton
                options={['Public', 'Private']}
                value={visibility}
                onChange={setVisibility}
                colors={colors}
              />
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
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 🔒 Confirm Delete Modal */}
      <ConfirmModal
        visible={showConfirm}
        message="Are you sure you want to delete this log?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        colors={colors}
      />
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
