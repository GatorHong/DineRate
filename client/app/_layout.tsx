//root layout
import { Stack } from 'expo-router';

export default function RootLayout() {
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
            }}
        />
        <Stack.Screen
            name="Register"
            options={{
                headerShown: true,
                headerBackTitle: 'Back',
            }}
        />
    </Stack>
  );
}
