import { Stack } from 'expo-router';
import { useThemeStyles } from '../../../constants/Styles';

export default function RootLayout() {
    const { colors } = useThemeStyles();
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerBackTitle: 'Home',
            headerLargeTitle : true,
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerTintColor: colors.text
        }}>
            <Stack.Screen
                name="Home"
                options={{
                    headerShown: true,
                    headerTitle : 'DineRate',
                }}
            />
        </Stack>
    );
}