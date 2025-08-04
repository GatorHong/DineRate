import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';

const TrackingListCard = ({ iconName, label, count, colors, styles }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/[logListType]/LogList',
      params: { logListType: label },
    });
  };

  return (
      <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={{ marginBottom: 15 }}
      >
        <View
            style={[
              styles.card,
              {
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                minHeight: 80,
                paddingVertical: 16,
              }
            ]}
        >
          <View style={[styles.cardIconContainer, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name={iconName} size={24} color={colors.buttonBackground} />
            </View>
            <Text style={{ fontSize: 16, color: colors.text, marginLeft: 12, fontWeight: '500' }}>{label}</Text>
          </View>
          <Text style={[styles.cardCount, { color: colors.tint }]}>{count}</Text>
        </View>
      </TouchableOpacity>
  );
};

export default function Profile() {
    const { styles, colors, colorScheme } = useThemeStyles();
    const router = useRouter();
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
    }, [refresh,router]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/', undefined, { shallow: true });
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

    const gradientColors = [colors.subScreenBackground, colors.background];

    if (!user) {
        return (
            <View style={[styles.container]}>
                <Text style={[styles.text, { color: 'red' }]}>Failed to load profile.</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.screenContainer, { paddingTop: 0, padding: 0 }]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"}
            />

            <View>
                <LinearGradient
                    colors={gradientColors}
                    style={{
                        paddingTop: Platform.OS === 'ios' ? 60 : 48,
                        paddingBottom: 24,
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            position: 'absolute',
                            top: Platform.OS === 'ios' ? 64 : 36,
                            right: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.buttonBackground,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            gap: 6,
                        }}
                        disabled={loading}
                    >
                        <Ionicons name="log-out-outline" size={20} color={colors.buttonText} />
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 16, alignItems: 'center' }}>
                        <LinearGradient
                            colors={[colors.tint, colors.buttonBackground]}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : (
                                <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </Text>
                            )}
                        </LinearGradient>
                    </View>

                    <Text style={[styles.title, { marginTop: 12, textAlign: 'center' }]}>
                        {loading ? "Loading..." : (user.name || 'No Name')}
                    </Text>

                    {!loading && user.role?.toLowerCase() === 'admin' && (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                backgroundColor: '#F57C00',
                                borderRadius: 20,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                marginTop: 12,
                            }}
                            onPress={handleAdminPress}
                            disabled={navigatingToAdmin}
                        >
                            <Ionicons name="shield-checkmark-outline" size={20} color={colors.buttonText} />
                            <Text style={styles.buttonText}>
                                {navigatingToAdmin ? 'Loading...' : 'Admin Panel'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </LinearGradient>
            </View>

            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ marginVertical: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Ionicons name="person-outline" size={20} color={colors.icon} />
                        <Text style={[styles.listHeader, { marginBottom: 0, marginLeft: 8 }]}>Account Details</Text>
                    </View>

                    <View style={[styles.formField, { marginBottom: 8 }]}>
                        <View style={styles.formFieldRow}>
                            <Text style={[styles.text, { color: colors.icon }]}>User ID</Text>
                            {loading ? (
                                <View style={{ width: 100, height: 16, backgroundColor: colors.border, borderRadius: 4 }} />
                            ) : (
                                <Text style={[styles.text, { fontWeight: 'bold' }]}>{user._id}</Text>
                            )}
                        </View>
                    </View>

                    
                </View>

                <View style={{ marginVertical: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Ionicons name="list-outline" size={20} color={colors.icon} />
                        <Text style={[styles.listHeader, { marginBottom: 0, marginLeft: 8 }]}>Your Lists</Text>
                    </View>

                    {loading ? (
                        <>
                            <View style={[styles.card, {
                                minHeight: 80,
                                paddingVertical: 16,
                                marginBottom: 16,
                                backgroundColor: colors.border,
                                opacity: 0.7
                            }]} />
                            <View style={[styles.card, {
                                minHeight: 80,
                                paddingVertical: 16,
                                backgroundColor: colors.border,
                                opacity: 0.7
                            }]} />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}