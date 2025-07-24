//show details for a specific log given by its ID
//example:
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text>Details of log {id} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
