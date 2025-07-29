import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../../constants/Styles';
import api from '../../services/api';

// 🔧 Disable Expo Router's default screen header
export const options = {
  headerShown: false,
};

// 🔹 Reusable tracking card with conditional routing
const TrackingListCard = ({ iconName, label, count, colors, styles, id }) => {
  const router = useRouter();

  const handlePress = () => {
    if (label === 'Dined') {
      const logListType = 'Dined';
      const logId = id || '12345'; // Replace '12345' with actual ID from data if available
      router.push({
        pathname: '/[logListType]/details/[id]',
        params: { logListType, id: logId },
      });
    } else {
      router.push({
        pathname: '/[logListType]/LogList',
        params: { logListType: label },
      });
    }
  };

  return (
    <TouchableOpacity style={[styles.card, { marginBottom: 12 }]} onPress={handlePress}>
      <View style={[styles.cardIconContainer, { flexDirection: 'row', alignItems: 'center' }]}>
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

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/Landing');
  };

  if (loading) {
    return (
      <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.text, { color: 'red' }]}>Failed to load profile.</Text>
        <TouchableOpacity onPress={handleLogout} style={[styles.buttonContainer, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { paddingTop: 0, marginTop: 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Logout button (top right) */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: 4 }}>
        <TouchableOpacity onPress={handleLogout} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Ionicons name="person-circle-outline" size={80} color={colors.icon} />
        <Text style={[styles.title, { marginTop: 6 }]}>{user.name || 'No Name'}</Text>
      </View>

      {/* Account Details */}
      <View style={{ marginTop: 16, paddingHorizontal: 24 }}>
        <Text style={[styles.title, { marginBottom: 6 }]}>Account Details</Text>
        <Text style={styles.text}>User ID: {user._id}</Text>
      </View>

      {/* Tracking List Cards */}
      <View style={{ marginTop: 16, paddingHorizontal: 24 }}>
        <TrackingListCard
          iconName="bookmark"
          label="To Dine"
          count={6}
          colors={colors}
          styles={styles}
        />
        <TrackingListCard
          iconName="checkmark-circle"
          label="Dined"
          count={3}
          colors={colors}
          styles={styles}
          
        />
      </View>
    </View>
  );
}
