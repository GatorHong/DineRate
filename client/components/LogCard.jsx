// use    <Link
//         href={{
//           pathname: '/details/[id]',
//           params: { id: 'logIdGoesHere' },
//         }}>
// to navigate to the details screen

//for now, just a button that navigates to the details screen
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStyles } from '../constants/Styles';
import { useRouter } from 'expo-router';

export default function LogCard({ log }) {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/(tabs)/(home)/[logListType]/details/[id]',
            params: {logListType : log.category, id: log.id },
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.cardIconContainer}>
                <Text style={styles.cardLabel}>{log.title}</Text>
                <Text style={styles.cardCount}>{log.description}</Text>
            </View>
        </TouchableOpacity>
    );
}
