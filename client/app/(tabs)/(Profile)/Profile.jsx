import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';
import api from '../../../services/api';

export const options = {
    headerShown: false,
};

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

            {/* Logout button (top right) */}
            <View style={localStyles.logoutRow}>
                <TouchableOpacity onPress={handleLogout} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={localStyles.avatarSection}>
                <Ionicons name="person-circle-outline" size={96} color={colors.icon} style={localStyles.avatar} />
                <Text style={[styles.title, { marginTop: 8 }]}>{user.name || 'No Name'}</Text>
            </View>

            {/* Account Details */}
            <View style={localStyles.section}>
                <Text style={[styles.listHeader, { marginBottom: 4 }]}>Account Details</Text>
                <View style={styles.formFieldRow}>
                    <Text style={styles.text}>User ID:</Text>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>{user._id}</Text>
                </View>
            </View>

            {/* Tracking List Cards */}
            <View style={localStyles.section}>
                <Text style={[styles.listHeader, { marginBottom: 8 }]}>Your Lists</Text>
                <View>
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
        </View>
    );
}

const localStyles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 8,
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
        marginBottom: 12
    },
    card: {
        minWidth: 140,
        marginHorizontal: 0,
        flex : undefined
    },
    cardIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});