import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text } from 'react-native';
import { useLayoutEffect } from 'react';
import { useThemeStyles } from '../../../../../constants/Styles';

export default function DetailsScreen({ navigation: stackNavigation, logData }) {
    const { id } = useLocalSearchParams();
    const { styles } = useThemeStyles();
    const navigation = stackNavigation || useNavigation();

    // Example logData,TODO: implement actual data fetching logic
    const log = logData || {
        title: 'Sample Log Title',
        date: '2024-06-10',
        description: 'This is a sample log description.',
        tags: ['example', 'log'],
    };

    useLayoutEffect(() => {
        navigation?.setOptions({
            headerShown: true,
            title: log.title || id,
        });
    }, [navigation, id, log.title]);

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>{log.title}</Text>
            <Text style={styles.listHeader}>Date</Text>
            <Text style={styles.text}>{log.date}</Text>
            <Text style={styles.listHeader}>Description</Text>
            <Text style={styles.text}>{log.description}</Text>
            {log.tags && log.tags.length > 0 && (
                <>
                    <Text style={styles.listHeader}>Tags</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                        {log.tags.map((tag, idx) => (
                            <View key={idx} style={[styles.buttonContainer, { marginRight: 8, marginBottom: 8 }]}>
                                <Text style={styles.buttonText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
}
