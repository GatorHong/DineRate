import { Stack } from 'expo-router';
import { useThemeStyles } from '../../../constants/Styles';

export default function RootLayout() {
    const { colors } = useThemeStyles();
    return (
    <Stack screenOptions={{
        headerShown: true,
        headerLargeTitle : true,
        headerStyle: {
            backgroundColor: colors.background,
        },
        headerTintColor: colors.text
    }}>
      <Stack.Screen
          name="Profile"
          options={{
            // Hide the header for this route
            headerShown: false,
          }}
      />
    </Stack>
  );
}

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: 'index',
};
