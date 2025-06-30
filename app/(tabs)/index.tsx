import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useThemeStyles } from '@/constants/Styles';

export default function Index() {
    const { styles } = useThemeStyles();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home screen</Text>
            <Link href="/(tabs)/testScreen" style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Go to Test screen</Text>
            </Link>
        </View>
    );
}