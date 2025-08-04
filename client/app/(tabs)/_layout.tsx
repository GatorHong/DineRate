import { useThemeStyles } from "@/constants/Styles";
import { AuthContext } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, router } from 'expo-router';
import { useContext } from 'react';

export default function TabLayout() {
  const { colors } = useThemeStyles();
  const auth = useContext(AuthContext); // ✅ safely access context
  const user = auth?.user;

  if (!auth) {
    console.warn('⚠️ AuthContext is undefined');
    return null; // or show a loading indicator
  }

  return (
    <Tabs
      initialRouteName="(Home)"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="(Home)"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="PlaceholderTab"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pencil' : 'pencil-outline'} color={color} size={24} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate('/LogScreen');
          },
        }}
      />

      <Tabs.Screen
        name="(Profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />

      {/* ✅ Conditionally show Admin tab */}
      {user?.role === 'Admin' && (
        <Tabs.Screen
          name="AdminPanel"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'shield' : 'shield-outline'} color={color} size={24} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
