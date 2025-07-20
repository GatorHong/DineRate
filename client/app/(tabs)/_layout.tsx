import { useThemeStyles } from "@/constants/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, router } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            initialRouteName="Home"
            screenOptions={{
                headerShown : false
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
                        router.push('../LogScreen');
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
