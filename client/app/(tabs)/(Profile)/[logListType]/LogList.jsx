import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';
import LogCard from '../../../../components/LogCard';
import { useThemeStyles } from '../../../../constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../services/api';

export default function LogList() {
  const { logListType } = useLocalSearchParams();
  const { styles, colors } = useThemeStyles();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: logListType,
    });
  }, [navigation, logListType]);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      console.log('🔎 Fetching logs for logType:', logListType);
      try {
        const res = await api.get('/logs', {
          params: { logType: logListType },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('✅ Logs loaded:', res.data);
        setLogs(res.data);
      } catch (err) {
        console.error('❌ Error loading logs:', err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [logListType]);

  const renderItem = ({ item }) => <LogCard log={item} />;

  return (
      <View style={styles.screenContainer}>
        {loading ? (
            <ActivityIndicator size="large" color={colors.tint} />
        ) : logs.length === 0 ? (
            <Text style={styles.text}>No logs found for &#34;{logListType}&#34;.</Text>
        ) : (
            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={[styles.listContainer, { flex: 0 }]}
            />
        )}
      </View>
  );
}