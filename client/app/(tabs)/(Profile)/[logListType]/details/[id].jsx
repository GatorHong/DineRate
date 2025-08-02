// app/(tabs)/(Profile)/[logListType]/details/[id].jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import LogForm from '../../../../../components/LogForm';
import { useThemeStyles } from '../../../../../constants/Styles';
import api from '../../../../../services/api';

export default function DetailsScreen() {
  const { id, mode, title } = useLocalSearchParams();
  const isEditMode = mode === 'edit';
  const navigation = useNavigation();
  const { styles, colors } = useThemeStyles();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            title: title || 'Log',
            headerShown: true,
            headerStyle: {
                backgroundColor: colors.background, // fixes white header
            },
            headerTintColor: colors.text, // optional: sets title/icon color
        });
    }, [navigation, title]);

    useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await api.get(`/logs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLog(res.data);
      } catch (err) {
        console.error('❌ Error fetching log:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id, navigation]);

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

  return isEditMode ? (
    <LogForm
      mode="edit"
      initialData={log}
      logId={id}
      onSaved={() => navigation.goBack()}
      onCancel={() => navigation.goBack()}
    />
  ) : (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>{log.title}</Text>
      <Text style={styles.listHeader}>Date</Text>
      <Text style={styles.text}>{new Date(log.createdAt).toLocaleString()}</Text>
      <Text style={styles.listHeader}>Description</Text>
      <Text style={styles.text}>{log.description}</Text>
      <Text style={styles.listHeader}>Location</Text>
      <Text style={styles.text}>{log.location}</Text>
      <Text style={styles.listHeader}>Food</Text>
      <Text style={styles.text}>{log.food}</Text>
      <Text style={styles.listHeader}>Rating</Text>
      <Text style={styles.text}>⭐ {log.rating}</Text>
      <Text style={styles.listHeader}>Visibility</Text>
      <Text style={styles.text}>{log.visibility}</Text>
      <Text style={styles.listHeader}>Log Type</Text>
      <Text style={styles.text}>{log.logType}</Text>
    </View>
  );
}
