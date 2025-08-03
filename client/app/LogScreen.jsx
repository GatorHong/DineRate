// screens/LogScreen.jsx
import { router } from 'expo-router';
import LogForm from '../components/LogForm';

export default function LogScreen() {
  return (
    <LogForm
      mode="create"
      onSaved={() => router.replace('/(tabs)/(Home)/Home')}
      onCancel={() => router.back()}
    />
  );
}
