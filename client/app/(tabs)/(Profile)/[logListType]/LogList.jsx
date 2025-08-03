import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import LogCard from '../../../../components/LogCard';
import { useThemeStyles } from '../../../../constants/Styles';
import api from '../../../../services/api';

export default function LogList() {
  const { logListType } = useLocalSearchParams();
  const { styles, colors } = useThemeStyles();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Set header title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: logListType,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, logListType]);

  // Fetch logs function
  const loadLogs = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await api.get('/logs', {
        params: { logType: logListType },
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error('❌ Error loading logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [logListType]);

  // Run on screen focus
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [loadLogs])
  );

  // ✅ Call this manually after log change
  const navigateBackToProfile = () => {
    router.push({ pathname: '/(tabs)/Profile', params: { refresh: 'true' } });
  };

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
          keyExtractor={(item) => item._id}
          contentContainerStyle={[styles.listContainer, { flex: 0 }]}
        />
      )}
    </View>
  );
}
