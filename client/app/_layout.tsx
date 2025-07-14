//root layout
import { Stack } from 'expo-router';
import { useThemeStyles } from '../constants/Styles';

export default function RootLayout() {
  const { colors } = useThemeStyles();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitle: '',
      }}
    />
  );
}
