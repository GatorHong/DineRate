import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../constants/Styles';

export default function LogMealForm({ onCancel, onSave }) {
    const { colors, styles } = useThemeStyles();
    const [location, setLocation] = useState('');
    const [food, setFood] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        // Implement save functionality here
        console.log('Save pressed');
        onSave({ location, food, title, description });
    };

    const handleAddImage = () => {
        // Implement image picker functionality here
        console.log('Add image pressed');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            {/* Header */}
            <View style={styles.formHeader}>
                <TouchableOpacity onPress={onCancel}>
                    <Text style={styles.actionButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.emphasisButton}>Done</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Log a Meal</Text>

                {/* Info Section */}
                <View style={styles.formSection}>
                    <Text style={styles.formSectionHeader}>Info</Text>

                    <View style={styles.formField}>
                        <View style={styles.formFieldRow}>
                            <Text style={styles.formFieldLabel}>Location</Text>
                            <TextInput
                                style={styles.formFieldInput}
                                placeholder="Enter Text"
                                placeholderTextColor={colors.icon}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>

                    <View style={styles.formField}>
                        <View style={styles.formFieldRow}>
                            <Text style={styles.formFieldLabel}>Food</Text>
                            <TextInput
                                style={styles.formFieldInput}
                                placeholder="Enter Text"
                                placeholderTextColor={colors.icon}
                                value={food}
                                onChangeText={setFood}
                            />
                        </View>
                    </View>
                </View>

                {/* Add Image Button */}
                <TouchableOpacity style={styles.formButton} onPress={handleAddImage}>
                    <Text style={styles.actionButton}>Add Image</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>

                {/* Log Section */}
                <View style={styles.formSection}>
                    <Text style={styles.formSectionHeader}>Log</Text>

                    <View style={localStyles(colors).logContainer}>
                        {/* Title Input */}
                        <View style={styles.formField}>
                            <View style={styles.formFieldRow}>
                                <Text style={styles.formFieldLabel}>Title</Text>
                                <TextInput
                                    style={styles.formFieldInput}
                                    placeholder="Optional"
                                    placeholderTextColor={colors.icon}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* Border with padding */}
                        <View style={styles.divider} />

                        {/* Description/Thoughts Input */}
                        <View style={localStyles(colors).descriptionContainer}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Enter your thoughts and description here..."
                                placeholderTextColor={colors.icon}
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>

                {/* Extra padding at bottom for keyboard */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const localStyles = (colors) => StyleSheet.create({
    logContainer: {
        backgroundColor: colors.sectionBackground,
        borderRadius: 10,
        overflow: 'hidden',
    },
    descriptionContainer: {
        padding: 16
    },
});
