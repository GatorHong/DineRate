// root layout
import { Stack } from 'expo-router';
import { useThemeStyles } from '../constants/Styles';
import { AuthProvider } from '../context/AuthContext'; // ✅ import AuthProvider

export default function RootLayout() {
  const { colors } = useThemeStyles();

  return (
    <AuthProvider> {/* ✅ Wrap all navigation inside the provider */}
      <Stack screenOptions={{ headerShown: false }}>
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
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="Register"
          options={{
            headerShown: true,
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
