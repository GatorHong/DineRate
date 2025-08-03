import { Stack } from 'expo-router';
import { useThemeStyles } from '../../../constants/Styles';

export default function RootLayout() {
    const { colors } = useThemeStyles();
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle : 'Restaurant',
            headerBackTitle: 'Home',
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerTintColor: colors.text
        }}>
            <Stack.Screen
                name="Home"
                options={{
                    headerShown: false,

                }}
            />
        </Stack>
    );
}