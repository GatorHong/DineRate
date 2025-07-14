//if you want to use tailwind, we can use https://www.nativewind.dev
import { StyleSheet, useColorScheme } from "react-native";

//Color palette
export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: '#0a7ea4',
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: '#0a7ea4',
        buttonText: '#fff',
        buttonBackground: '#0a7ea4',
        border: '#E6E8EB',
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: '#fff',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#fff',
        buttonText: '#fff',
        buttonBackground: '#0a7ea4',
        border: '#2E3235',
    },
};

export const createThemedStyles = (theme: 'light' | 'dark') => {
    const colors = Colors[theme];

    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        screenContainer: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 24,
            justifyContent: 'center'
        },
        text: {
            color: colors.text,
            fontSize: 16,
        },
        title: {
            color: colors.text,
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 12,
            marginTop: 12,
        },
        buttonContainer: {
            padding: 10,
            backgroundColor: colors.buttonBackground,
            borderRadius: 5,
            marginTop: 10,
            marginBottom: 10,
        },
        buttonText: {
            color: colors.buttonText,
            fontWeight: 'bold',
        },
        link: {
            color: colors.tint,
            textDecorationLine: 'underline',
            fontSize: 20,
        },
        input: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 6,
            padding: 12,
            marginBottom: 16,
            color: colors.text
        },
        listContainer: {
            marginBottom: 12,
            flex: 1
        },
        listHeader: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.icon,
            marginBottom: 10,
        },
        restaurantItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            borderRadius: 8,
            marginBottom: 8,
        },
        restaurantName: {
            fontSize: 16,
            color: colors.text,
        },
        // New styles for dashboard cards
        dashboardContainer: {
            marginBottom: 16,
            flex : 1
        },
        cardRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,

        },
        card: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cardIconContainer: {
            alignItems: 'center',
        },
        cardLabel: {
            marginTop: 8,
            fontSize: 14,
            color: colors.text,
        },
        cardCount: {
            fontSize: 40,
            fontWeight: 'bold',
            color: colors.text,
        },
    });
};

// Hook to use the themed styles and colors
//see layout.tsx for usage
export function useThemeStyles() {
    const colorScheme = useColorScheme() || 'light';
    const themeColors = Colors[colorScheme as 'light' | 'dark'];
    const styles = createThemedStyles(colorScheme as 'light' | 'dark');

    return {
        colors: themeColors,
        styles,
        colorScheme
    };
}
