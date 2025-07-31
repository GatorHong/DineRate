//root layout
import { Stack } from 'expo-router';
import { useThemeStyles } from '../constants/Styles';

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
    </Stack>
  );
}
