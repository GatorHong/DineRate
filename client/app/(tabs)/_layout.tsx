import { useThemeStyles } from "@/constants/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    const { colors } = useThemeStyles();

    return (
        <Tabs
            initialRouteName="Home"
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
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24}/>
                    ),
                }}
            />
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
        </Tabs>
    );
}
