// app/modal.tsx
import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';


export default function LogScreen() {
    return (
        <View>
            <Text>This is a actually a modal!</Text>
            <Button title="Close" onPress={() => router.back()} />
        </View>
    );
}
