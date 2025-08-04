import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import api from '../services/api';
import IconScroller from "../components/ScrollingIcons";

export default function Register() {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

    const [form, setForm] = useState({ name: '', username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (key) => (text) => {
        setForm((prev) => ({ ...prev, [key]: text }));
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.name || !form.username || !form.password) {
            setError('All fields are required.');
            return;
        }

        try {
            const res = await api.post('/auth/register', form);
            await AsyncStorage.setItem('token', res.data.token);
            router.replace('/Login');
        } catch (err) {
            const status = err.response?.status;
            const msg =
                status === 409
                    ? 'Username already exists. Try a different one.'
                    : err.response?.data?.message || '❌ Registration failed.';
            setError(msg);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={localStyles.container}>
            <ScrollView contentContainerStyle={localStyles.scrollContent}>
                <View style={localStyles.headerSection}>
                    <IconScroller colors={colors} />
                </View>

                <View style={localStyles.formSection}>
                    <Text style={styles.title}>Register</Text>

                    {error ? (
                        <Text style={localStyles.errorText}>
                            {error}
                        </Text>
                    ) : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={colors.icon}
                        value={form.name}
                        onChangeText={handleChange('name')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={colors.icon}
                        value={form.username}
                        onChangeText={handleChange('username')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.icon}
                        secureTextEntry
                        value={form.password}
                        onChangeText={handleChange('password')}
                    />

                    <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    headerSection: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 0,
    },
    formSection: {
        marginTop: 20, // Add space between scroller and form
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center'
    }
});