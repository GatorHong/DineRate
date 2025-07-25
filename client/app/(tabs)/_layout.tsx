import { useThemeStyles } from "@/constants/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, router } from 'expo-router';

export default function TabLayout() {
    const { colors } = useThemeStyles();
    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.background, // fixes white header
                },
                headerTintColor: colors.text, // optional: sets title/icon color
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.tabIconSelected,
                tabBarInactiveTintColor: colors.tabIconDefault,
                }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    headerShown : false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="PlaceholderTab"
                options={{
                    title: 'Log',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'pencil' : 'pencil-outline'} color={color} size={24}/>
                    )
                }}
                listeners={{
                    tabPress: (e) => {
                        // prevent default navigation
                        e.preventDefault();
                        // open the modal instead
                        router.navigate('/LogScreen');
                    }
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
                    ),
                }}
            />
        </Tabs>
    );
}
