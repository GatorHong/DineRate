import { useThemeStyles } from '../../constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../services/api';

export default function Register() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (key) => (text) => {
    setForm((prev) => ({ ...prev, [key]: text }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.username || !form.password) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await api.post('/auth/register', form);
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/Login');
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 409
          ? 'Username already exists. Try a different one.'
          : err.response?.data?.message || '❌ Registration failed.';
      setError(msg);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Register</Text>

      {error ? (
        <Text style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={handleChange('name')}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={handleChange('username')}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={handleChange('password')}
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
