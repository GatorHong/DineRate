//root layout
import { Stack } from 'expo-router';
import { useThemeStyles } from '../constants/Styles';

export default function RootLayout() {
    const { colors } = useThemeStyles();
  return (
    <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen
            name="LogScreen"
            options={{
                presentation: 'modal',
            }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
            name="Login"
            options={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerStyle: {
                    backgroundColor: colors.background, // fixes white header
                },
                headerTintColor: colors.text, // optional: sets title/icon color
            }}
        />
        <Stack.Screen
            name="Register"
            options={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerStyle: {
                    backgroundColor: colors.background, // fixes white header
                },
                headerTintColor: colors.text, // optional: sets title/icon color
            }}
        />
    </Stack>
  );
}
