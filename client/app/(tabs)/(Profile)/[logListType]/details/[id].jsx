import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useThemeStyles } from '../../../../../constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../services/api';

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const { styles, colors } = useThemeStyles();
    const navigation = useNavigation();
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation?.setOptions({
            headerShown: true,
            title: log?.title || id,
        });
    }, [navigation, id, log?.title]);

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
                setLog(null);
            } finally {
                setLoading(false);
            }
        };
        fetchLog();
    }, [id]);

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

    //TODO: Make look good and add more details
    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>{log.title}</Text>
            <Text style={styles.listHeader}>Date</Text>
            <Text style={styles.text}>{log.createdAt}</Text>
            <Text style={styles.listHeader}>Description</Text>
            <Text style={styles.text}>{log.description}</Text>
        </View>
    );
}