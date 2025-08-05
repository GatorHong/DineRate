import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconScroller from "../components/ScrollingIcons";
import { useThemeStyles } from '../constants/Styles';
import api from '../services/api';

export default function Register() {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

    const [form, setForm] = useState({ name: '', username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const handleChange = (key) => (text) => {
        setForm((prev) => ({ ...prev, [key]: text }));
        setError('');
    };

    const animateSuccess = () => {
        // Reset animations
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);

        // Start animations
        Animated.sequence([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.elastic(1.2),
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleSubmit = async () => {
        if (!form.name || !form.username || !form.password) {
            setError('All fields are required.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/register', form);
            await AsyncStorage.setItem('token', res.data.token);

            // Show success animation
            setShowSuccess(true);
            animateSuccess();

            // Navigate after animation completes
            setTimeout(() => {
                router.replace('/Login');
            }, 1500);

        } catch (err) {
            setIsLoading(false);
            const status = err.response?.status;
            const msg =
                status === 409
                    ? 'Username already exists. Try a different one.'
                    : err.response?.data?.message || '❌ Registration failed.';
            setError(msg);
        }
    };

    return (
        <View style={styles.screenContainer}>
            {showSuccess ? (
                <View style={localStyles.successOverlay}>
                    <Animated.View
                        style={[
                            localStyles.successCircle,
                            {
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim,
                                backgroundColor: colors.buttonBackground,
                            }
                        ]}
                    >
                        <Ionicons name="checkmark" size={50} color="#fff" />
                    </Animated.View>
                    <Animated.Text
                        style={[
                            styles.text,
                            localStyles.successText,
                            { opacity: opacityAnim }
                        ]}
                    >
                        Registration Successful
                    </Animated.Text>
                </View>
            ) : (
                <>
                    <View style={localStyles.topSection}>
                        <IconScroller colors={colors} />
                    </View>

                    <View style={[styles.formContainer, localStyles.formWrapper]}>
                        <Text style={styles.title}>Register</Text>

                        {error ? (
                            <View style={localStyles.errorContainer}>
                                <Ionicons name="warning-outline" size={18} color="red" style={{ marginRight: 6 }} />
                                <Text style={localStyles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={colors.icon}
                            value={form.name}
                            onChangeText={handleChange('name')}
                            editable={!isLoading}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor={colors.icon}
                            value={form.username}
                            onChangeText={handleChange('username')}
                            editable={!isLoading}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.icon}
                            secureTextEntry
                            value={form.password}
                            onChangeText={handleChange('password')}
                            editable={!isLoading}
                        />

                        <TouchableOpacity
                            style={[styles.buttonContainer, isLoading && localStyles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>{isLoading ? "Registering..." : "Register"}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffdddd',
        padding: 8,
        borderRadius: 6,
        marginBottom: 12,
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
        flexShrink: 1,
    },
    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    topSection: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formWrapper: {
        flex: 1,
    }
});