import { useThemeStyles } from "@/constants/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, router } from 'expo-router';

export default function TabLayout() {
    const { colors } = useThemeStyles();
    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                headerShown : false,
                tabBarStyle: {
                    backgroundColor: colors.background, // Change this to your desired background color
                    borderTopColor: colors.border, // Change this to your desired border color
                },
                tabBarActiveTintColor: colors.tabIconSelected, // Color for active tab icons and text
                tabBarInactiveTintColor: colors.tabIconDefault, // Color for inactive tab icons and text

            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
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
                        router.navigate('../../LogScreen');
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
