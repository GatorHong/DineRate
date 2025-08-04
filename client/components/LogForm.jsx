import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
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
            borderColor: colors.buttonBorder,
            backgroundColor:
              value === option ? colors.buttonBackground : colors.sectionBackground,
          }}
          onPress={() => onChange(option)}
        >
          <Text
            style={{
              color: value === option ? colors.buttonText : colors.text,
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
  const { colors: defaultColors } = useThemeStyles();
  const colorScheme = useColorScheme();

  // Custom light mode color palette
  const customLightColors = {
    background: defaultColors.logFormBackground,
    sectionBackground: '#f5f2e3', // Lighter version of background for better contrast
    text: '#4c5760',
    secondaryText: '#66635b',
    border: defaultColors.border,
    buttonBackground: '#17a398',
    buttonBorder: '#17a398',
    buttonText: '#ffffff',
    icon: '#66635b',
    starColor: '#9b2915',
    emphasisText: '#17a398',
    deleteButton: '#9b2915',
    inputBackground: '#f5f2e3'
  };

  // Use custom colors in light mode, default colors in dark mode
  const colors = colorScheme === 'light' ? customLightColors : defaultColors;

  // Custom styles for the form
  const customStyles = StyleSheet.create({
    formContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.sectionBackground,
    },
    actionButton: {
      color: colors.text,
      fontSize: 16,
      borderColor: colors.buttonBorder,
    },
    emphasisButton: {
      color: colors.emphasisText,
      fontWeight: 'bold',
      fontSize: 16,
    },
    deleteButton: {
      color: colors.deleteButton,
      fontSize: 16,
    },
    formFieldInput: {
      backgroundColor: colors.inputBackground,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    textArea: {
      backgroundColor: colors.inputBackground,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      minHeight: 100,
    },
    formFieldLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    title: {
      color: colors.text,
      fontWeight: 'bold',
    }
  });

  const [token, setToken] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tags, setTags] = useState(initialData.tags?.join(' ') || '');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [food, setFood] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [logType, setLogType] = useState('Dined');
  const [googleRating, setGoogleRating] = useState(null);

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
        setGoogleRating(initialData.googleRating ?? null);
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
    setGoogleRating(item.rating ?? null);

    setSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      if (!token) return;
      if (!location.trim()) {
        alert('Please select a restaurant before submitting.');
        return;
      }
      const formattedTags = tags
        .split(' ')
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#') && tag.length > 1);

      const payload = {
        title,
        description,
        location,
        food,
        visibility,
        logType,
        photoUrl,
        rating,
        googleRating,
        tags: formattedTags,
      };

      const resp = isEdit
        ? await api.put(`/logs/${logId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await api.post('/logs', payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      router.back({params: { refresh: 'true' }});
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
      router.back({params: { refresh: 'true' }});
    } catch (err) {
      console.error('❌ Error deleting log:', err.message);
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  // Create components for the form header and form content
  const FormHeader = (
    <View style={customStyles.formHeader}>
      <TouchableOpacity onPress={onCancel}>
        <Text style={customStyles.actionButton}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={customStyles.emphasisButton}>{isEdit ? 'Save' : 'Done'}</Text>
      </TouchableOpacity>
      {isEdit && (
        <TouchableOpacity onPress={handleDelete}>
          <Text style={customStyles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Form content before suggestions (to fix virtualized list issue)
  const FormContentBefore = (
    <>
      {/* Title */}
      {!isEdit && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="pencil-outline" size={24} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={[customStyles.title, { fontSize: 24 }]}>
            Log a Meal
          </Text>
        </View>
      )}

        {/* Restaurant Preview (with image and rating) */}
        {title !== '' && (
          <View
            style={{
              backgroundColor: colors.sectionBackground,
              padding: 12,
              borderRadius: 12,
              flexDirection: 'row',
              marginBottom: 16,
              gap: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  backgroundColor: colors.border,
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>{title}</Text>
              <Text style={{ color: colors.secondaryText, fontSize: 12 }}>{location}</Text>
              {googleRating && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="globe-outline" size={12} color={colors.buttonBackground} style={{ marginRight: 4 }} />
                  <Text style={{ color: colors.buttonBackground, fontSize: 12 }}>
                    Google Rating: {Number(googleRating).toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

      {/* Restaurant Search */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name="restaurant-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
        <Text style={customStyles.formFieldLabel}>Restaurant</Text>
      </View>
      <TextInput
        style={customStyles.formFieldInput}
        placeholder="Search restaurant..."
        placeholderTextColor={colors.secondaryText}
        value={location}
        onChangeText={handleSearch}
      />
    </>
  );

  // Form content after suggestions (to fix virtualized list issue)
  const FormContentAfter = (
    <>
      {/* Your Rating */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 4 }}>
        <Ionicons name="star-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
        <Text style={customStyles.formFieldLabel}>Your Rating</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Ionicons
              name={num <= rating ? 'star' : 'star-outline'}
              size={32}
              color={num <= rating ? colors.starColor : colors.text}
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>
        ))}
      </View>

        {/* Food */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="fast-food-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
          <Text style={customStyles.formFieldLabel}>What did you eat?</Text>
        </View>
        <TextInput
          style={customStyles.formFieldInput}
          placeholder="e.g. Pizza, Pho, Sushi"
          placeholderTextColor={colors.secondaryText}
          value={food}
          onChangeText={setFood}
        />

        {/* Description */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 4 }}>
          <Ionicons name="document-text-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
          <Text style={customStyles.formFieldLabel}>Description</Text>
        </View>
        <TextInput
          style={customStyles.textArea}
          placeholder="What did you think about while eating? How was the meal?"
          placeholderTextColor={colors.secondaryText}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

      {/* Category & Visibility */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="list-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={customStyles.formFieldLabel}>Category</Text>
          </View>
          <ToggleButton
            options={['Dined', 'To Dine']}
            value={logType}
            onChange={setLogType}
            colors={colors}
          />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="eye-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={customStyles.formFieldLabel}>Visibility</Text>
          </View>
          <ToggleButton
            options={['Public', 'Private']}
            value={visibility}
            onChange={setVisibility}
            colors={colors}
          />
        </View>
      </View>

      {/* Tags */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 4 }}>
        <Ionicons name="pricetag-outline" size={18} color={colors.text} style={{ marginRight: 6 }} />
        <Text style={customStyles.formFieldLabel}>Tags</Text>
      </View>
      <TextInput
        style={customStyles.formFieldInput}
        placeholder="e.g. #spicy #birthday #tacos"
        placeholderTextColor={colors.secondaryText}
        value={tags}
        onChangeText={setTags}
      />

      <View style={{ height: 40 }} />
    </>
  );

  // Render a suggestion item
  const renderSuggestionItem = ({ item }) => (
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
        borderRadius: 8,
        marginBottom: 2,
        marginHorizontal : 8,
      }}
    >
      {item.photo_url && (
        <Image
          source={{ uri: item.photo_url }}
          style={{ width: 50, height: 50, borderRadius: 8 }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>{item.address}</Text>
        {item.rating && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={12} color={colors.starColor} style={{ marginRight: 4 }} />
            <Text style={{ color: colors.starColor, fontSize: 12 }}>{item.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={customStyles.formContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {FormHeader}

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id}
        renderItem={renderSuggestionItem}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            {FormContentBefore}
          </View>
        }
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            {FormContentAfter}
          </View>
        }
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      />

      {/* Confirm Delete Modal */}
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