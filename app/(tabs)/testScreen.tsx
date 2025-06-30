import { Text, View, StyleSheet } from 'react-native';
import {useThemeStyles} from "@/constants/Styles";

export default function TestScreen() {
    const { styles } = useThemeStyles();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Test screen</Text>
        </View>
    );
}