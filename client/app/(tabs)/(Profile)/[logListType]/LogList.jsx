import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import LogCard from '../../../../components/LogCard';
import { useThemeStyles } from '../../../../constants/Styles';
import api from '../../../../services/api'; // ✅ using your axios instance

export default function LogList() {
  const { logListType } = useLocalSearchParams();
  const { styles, colors } = useThemeStyles();
  const navigation = useNavigation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: logListType,
    });
  }, [navigation, logListType]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        const response = await api.get('/logs', {
          params: { category: logListType }
        });

        setLogs(response.data);
      } catch (err) {
        console.error('❌ Error fetching logs:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [logListType]);

  const renderItem = ({ item }) => <LogCard log={item} />;

  return (
    <View style={styles.screenContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={[
            styles.listContainer,
            {
              flexGrow: 1,
              paddingBottom: 16,
            },
          ]}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: colors.text }}>
              No logs found.
            </Text>
          }
        />
      )}
    </View>
  );
}
