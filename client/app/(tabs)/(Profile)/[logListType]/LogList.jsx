import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import LogCard from '../../../../components/LogCard';
import { useThemeStyles } from '../../../../constants/Styles';

export default function LogList() {
  const { logListType } = useLocalSearchParams();
  const { styles, colors } = useThemeStyles();
  const [loading] = useState(false);
  const navigation = useNavigation();

  // ✅ Set title, but don't override headerLeft or back behavior
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: logListType,
    });
  }, [navigation, logListType]);

  // Dummy data
  const logs = [
    { id: '1', title: 'Log 1', location: 'Location 1', category: logListType, rating: 4.5, tag: 'tag1' },
    { id: '2', title: 'Log 2', location: 'Location 2', category: logListType, rating: 3.8, tag: 'tag2' },
    { id: '3', title: 'Log 3', location: 'Location 3', category: logListType, rating: 2.6, tag: 'tag2' },
  ];

  const renderItem = ({ item }) => <LogCard log={item} />;

  return (
    <View style={styles.screenContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContainer, { flex: 0 }]}
        />
      )}
    </View>
  );
}
