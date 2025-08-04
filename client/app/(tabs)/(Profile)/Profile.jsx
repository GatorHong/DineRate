import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';

const TrackingListCard = ({ iconName, label, count, colors, styles }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.card, localStyles.card, { marginBottom: 16, padding: 16 }]}
      onPress={() =>
        router.push({
          pathname: '/[logListType]/LogList',
          params: { logListType: label },
        })
      }
    >
      <View style={[styles.cardIconContainer, localStyles.cardIconContainer]}>
        <Ionicons name={iconName} size={28} color={colors.text} />
        <Text style={styles.cardLabel}>{label}</Text>
      </View>
      <Text style={styles.cardCount}>{count}</Text>
    </TouchableOpacity>
  );
};

export default function Profile() {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();
  const navigation = useNavigation();
  const { refresh } = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [logStats, setLogStats] = useState({ toDine: 0, dined: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [navigatingToAdmin, setNavigatingToAdmin] = useState(false);
  const fetchInProgress = useRef(false);

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      const token = await AsyncStorage.getItem('token');

      const [profileRes, statsRes] = await Promise.all([
        api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get('/logs/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUser(profileRes.data);
      setLogStats(statsRes.data);
    } catch (error) {
      console.error('❌ Error fetching profile or stats:', error.message);
      setUser(null);
    } finally {
      if (isInitial) setLoading(false);
      else setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (fetchInProgress.current) return;

      fetchInProgress.current = true;
      fetchData(true).finally(() => {
        fetchInProgress.current = false;
      });
    }, [])
  );

  useEffect(() => {
    if (refresh === 'true') {
      fetchData(false).then(() => {
        router.replace('/(tabs)/Profile');
      });
    }
  }, [refresh]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Login');
  };

  const handleAdminPress = () => {
    setNavigatingToAdmin(true);
    setTimeout(() => {
      router.push('/AdminPanel');
      Toast.show('Navigated to Admin Panel', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      setNavigatingToAdmin(false);
    }, 500);
  };

  if (loading) {
    return (
      <View style={[styles.screenContainer, localStyles.centered]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.screenContainer, localStyles.centered]}>
        <Text style={[styles.text, { color: 'red' }]}>Failed to load profile.</Text>
        <TouchableOpacity onPress={handleLogout} style={[styles.buttonContainer, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { paddingTop: 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={localStyles.avatarSection}>
        {/* Top-right Logout */}
        <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={handleLogout} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + Name */}
        <Ionicons name="person-circle-outline" size={96} color={colors.icon} style={localStyles.avatar} />
        <Text style={[styles.title, { marginTop: 8 }]}>{user.name || 'No Name'}</Text>

        {/* Admin Panel Button */}
        {user.role?.toLowerCase() === 'admin' && (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {
                marginTop: 12,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              },
            ]}
            onPress={handleAdminPress}
            disabled={navigatingToAdmin}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {navigatingToAdmin ? 'Loading...' : 'Go to Admin Panel'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={localStyles.section}>
        <Text style={[styles.listHeader, { marginBottom: 4 }]}>Account Details</Text>
        <View className={styles.formFieldRow}>
          <Text style={styles.text}>
            User ID: <Text style={[styles.text, { fontWeight: 'bold' }]}>{user._id}</Text>
          </Text>
        </View>
      </View>

      <View style={localStyles.section}>
        <Text style={[styles.listHeader, { marginBottom: 8 }]}>Your Lists</Text>
        <View>
          <TrackingListCard
            iconName="bookmark"
            label="To Dine"
            count={logStats.toDine}
            colors={colors}
            styles={styles}
          />
          <TrackingListCard
            iconName="checkmark-circle"
            label="Dined"
            count={logStats.dined}
            colors={colors}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
    marginBottom: 12,
  },
  card: {
    minWidth: 140,
    marginHorizontal: 0,
    flex: undefined,
  },
  cardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
