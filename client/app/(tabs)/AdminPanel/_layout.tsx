import { Stack } from 'expo-router';

export default function AdminLayout() {
  return <Stack screenOptions={{ headerShown: true, title: 'Admin Panel' }} />;
}
