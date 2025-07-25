import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import api from '../services/api';

export default function LogScreen() {
  const { colors, styles } = useThemeStyles();
  const [location, setLocation] = useState('');
  const [food, setFood] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No auth token found. Are you logged in?');
        return;
      }

      const payload = {
        title,
        description,
        location,
        food,
      };

      console.log('📤 Sending log payload:', payload);

      const response = await api.post('/logs', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Log successfully saved to server:', response.data);

      // ✅ Navigate to the Home screen after success
      router.replace('/(tabs)/(home)/Home');

    } catch (err) {
      console.error('❌ Error saving log:');
      if (err.response) {
        console.error('Server responded with:', err.response.data);
      } else {
        console.error(err.message);
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Header */}
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.actionButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.emphasisButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Log a Meal</Text>

        <View style={styles.formSection}>
          <Text style={styles.formSectionHeader}>Info</Text>

          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Location</Text>
              <TextInput
                style={styles.formFieldInput}
                placeholder="Enter Text"
                placeholderTextColor={colors.icon}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <View style={styles.formFieldRow}>
              <Text style={styles.formFieldLabel}>Food</Text>
              <TextInput
                style={styles.formFieldInput}
                placeholder="Enter Text"
                placeholderTextColor={colors.icon}
                value={food}
                onChangeText={setFood}
              />
            </View>
          </View>
        </View>

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

const localStyles = (colors) => StyleSheet.create({
  logContainer: {
    backgroundColor: colors.sectionBackground,
    borderRadius: 10,
    overflow: 'hidden',
  },
  descriptionContainer: {
    padding: 16
  },
});
