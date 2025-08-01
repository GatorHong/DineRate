// app/(tabs)/(Profile)/[logListType]/details/[id].jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import LogForm from '../../../../../components/LogForm';
import { useThemeStyles } from '../../../../../constants/Styles';
import api from '../../../../../services/api';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { styles, colors } = useThemeStyles();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await api.get(`/logs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLog(res.data);
        navigation.setOptions({ headerShown: true, title: res.data.title || 'Edit Log' });
      } catch (err) {
        console.error('❌ Error fetching log:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!log) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.text}>Log not found.</Text>
      </View>
    );
  }

  return (
    <LogForm
      mode="edit"
      initialData={log}
      logId={id}
      onSaved={() => navigation.goBack()}
      onCancel={() => navigation.goBack()}
    />
  );
}
