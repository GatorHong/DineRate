import { Tabs } from 'expo-router';
import {useThemeStyles} from "@/constants/Styles";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    const { styles, colors } = useThemeStyles();

    return (
        <Tabs
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
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="testScreen"
                options={{
                    title: 'Test',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
                    ),
                }}
            />
        </Tabs>
    );
}
