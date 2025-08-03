import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
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
