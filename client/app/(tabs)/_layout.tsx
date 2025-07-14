import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';

export default function TabsLayout() {
  const [authenticated, setAuthenticated] = useState(null);

<<<<<<< Updated upstream
    return (
        <Tabs
            initialRouteName="Login"
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerShadowVisible: true,
                headerTintColor: colors.tint,
                tabBarStyle: {
                    backgroundColor: colors.background
                },
            }}
        >
            <Tabs.Screen
                name="Login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'cloud-circle' : 'cloud-circle-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Register"
                options={{
                    title: 'Register',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person-add' : 'person-add-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarButton: () => null, // Hide Home from tab bar
                }}
            />
        </Tabs>
    );
}
=======
  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      setAuthenticated(!!token);
    });
  }, []);

  if (authenticated === null) return null; // Loading

  if (!authenticated) return <Redirect href="/Landing" />;

  return (
    <Tabs>
      <Tabs.Screen name="Home" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="Profile" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} /> }} />
    </Tabs>
  );
}
>>>>>>> Stashed changes
