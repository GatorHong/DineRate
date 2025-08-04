import { useThemeStyles } from "@/constants/Styles";
import { AuthContext } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, router } from "expo-router";
import { useContext } from "react";
import {BlurView} from "expo-blur";
import {Platform, StyleSheet, View} from "react-native";

export default function TabLayout() {
  const { colors } = useThemeStyles();
  const { user } = useContext(AuthContext);

  // ✅ Wait for user to be defined
  if (!user) return null;

  const isAdmin = user.role?.toLowerCase() === "admin";

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
                  borderTopColor: colors.border,
                  position: "absolute",
                  // Add backgroundColor for web only
                  ...(Platform.OS === 'web' && { backgroundColor: colors.background }),
              },
              tabBarBackground: () => (
                  Platform.OS === 'web'
                      ? <View style={[StyleSheet.absoluteFill]} />
                      : <BlurView
                          tint='light'
                          intensity={80}
                          style={StyleSheet.absoluteFill}
                      />
              ),
              tabBarActiveTintColor: colors.tabIconSelected,
              tabBarInactiveTintColor: colors.tabIconDefault,
          }}
      >
      <Tabs.Screen
        name="(Home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="PlaceholderTab"
        options={{
          title: "Log",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pencil" : "pencil-outline"}
              color={color}
              size={24}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate("/LogScreen");
          },
        }}
      />

      <Tabs.Screen
        name="(Profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* ✅ Show AdminRedirect tab only if role is admin */}
      {isAdmin && (
        <Tabs.Screen
          name="AdminRedirect"
          options={{
            title: "Admin",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "shield" : "shield-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
