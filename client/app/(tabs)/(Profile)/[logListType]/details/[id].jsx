import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useThemeStyles } from '../../../../../constants/Styles';
import api from '../../../../../services/api';

export default function DetailsScreen() {
    const { id, mode } = useLocalSearchParams();
    const { styles, colors } = useThemeStyles();
    const navigation = useNavigation();
    const isEditMode = mode === 'edit';

    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editedLog, setEditedLog] = useState({ title: '', description: '' });
    const [saving, setSaving] = useState(false);

    useLayoutEffect(() => {
        navigation?.setOptions({
            headerShown: true,
            title: isEditMode ? 'Edit Log' : log?.title || id,
        });
    }, [navigation, id, log?.title, isEditMode]);

    useEffect(() => {
        const fetchLog = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await api.get(`/logs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLog(res.data);
                setEditedLog({ title: res.data.title, description: res.data.description });
            } catch (err) {
                console.error('❌ Error fetching log:', err);
                setLog(null);
            } finally {
                setLoading(false);
            }
        };
        fetchLog();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const res = await api.put(
                `/logs/${id}`,
                editedLog,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            Alert.alert('✅ Log updated successfully!');
            navigation.goBack();
        } catch (err) {
            console.error('❌ Error updating log:', err);
            Alert.alert('❌ Failed to update log');
        } finally {
            setSaving(false);
        }
    };

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

    return (
        <ScrollView contentContainerStyle={styles.screenContainer}>
            {isEditMode ? (
                <>
                    <Text style={styles.listHeader}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={editedLog.title}
                        onChangeText={(text) => setEditedLog({ ...editedLog, title: text })}
                    />

                    <Text style={styles.listHeader}>Description</Text>
                    <TextInput
                        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                        multiline
                        value={editedLog.description}
                        onChangeText={(text) => setEditedLog({ ...editedLog, description: text })}
                    />

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title={saving ? 'Saving...' : 'Save'}
                            onPress={handleSave}
                            disabled={saving}
                        />
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.title}>{log.title}</Text>
                    <Text style={styles.listHeader}>Date</Text>
                    <Text style={styles.text}>{new Date(log.createdAt).toLocaleString()}</Text>
                    <Text style={styles.listHeader}>Description</Text>
                    <Text style={styles.text}>{log.description}</Text>
                </>
            )}
        </ScrollView>
    );
}
