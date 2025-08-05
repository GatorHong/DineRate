import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
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
      headerLargeTitle: true,
      headerStyle: {
        backgroundColor: colors.subScreenHeaderBackground,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, logListType, colors]);

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

  // Call this manually after log change
  const navigateBackToProfile = () => {
    router.push({ pathname: '/(tabs)/Profile', params: { refresh: 'true' } });
  };

  const renderItem = ({ item }) => <LogCard log={item} />;

  const renderPlaceholderItem = ({ index }) => <LogCard placeholder={true} />;

  // Empty state component
  const EmptyListComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
      <Text style={styles.text}>No logs found for &ldquo;{logListType}&rdquo;.</Text>
    </View>
  );

  // Generate placeholder data
  const placeholderData = Array(4).fill().map((_, index) => ({ id: `placeholder-${index}` }));

  // Render content based on loading state
  const renderContent = () => {
    if (loading) {
      return (
        <FlatList
          data={placeholderData}
          renderItem={renderPlaceholderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 80,
            paddingTop: 16,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={true}
          contentInsetAdjustmentBehavior="automatic"
        />
      );
    }

    return (
        <FlatList
            data={logs}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 80,
              paddingTop: 16,
              flexGrow: logs.length === 0 ? 1 : undefined
            }}
            showsVerticalScrollIndicator={true}
            contentInsetAdjustmentBehavior="automatic"
            ListEmptyComponent={EmptyListComponent}
        />
    );
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { paddingTop: 20, backgroundColor: colors.subScreenBackground }]}>
      {renderContent()}
    </SafeAreaView>
  );
}