//if you want to use tailwind, we can use https://www.nativewind.dev
import { StyleSheet, useColorScheme } from "react-native";

//Color palette
export const Colors = {
    light: {
        text: '#11181C',
        background: '#F5F5F5',
        tint: '#007AFF',
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: '#0a7ea4',
        buttonText: '#fff',
        buttonBackground: '#007AFF',
        sectionBackground: '#FFFF',
        border: '#E6E8EB',
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: '#fff',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#007AFF',
        buttonText: '#fff',
        buttonBackground: '#007AFF',
        sectionBackground: '#151718',
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
        restaurantListItem: {
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
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            color : colors.sectionBackground,
            backgroundColor: colors.sectionBackground,
        },
        cardIconContainer: {
            alignItems: 'center',
            color : colors.sectionBackground,
            backgroundColor: colors.sectionBackground,
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
        // Form styles
        formContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        formHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.sectionBackground,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
        },
        formContent: {
            flex: 1,
            padding: 16,
        },
        formSection: {
            marginBottom: 24,
        },
        formSectionHeader: {
            fontSize: 13,
            fontWeight: '400',
            color: colors.icon,
            textTransform: 'uppercase',
            marginBottom: 8,
            letterSpacing: -0.08,
        },
        formField: {
            backgroundColor: colors.sectionBackground,
            borderRadius: 10,
            marginBottom: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        formFieldRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        formFieldLabel: {
            fontSize: 17,
            color: colors.text,
            flex: 1,
        },
        formFieldInput: {
            fontSize: 17,
            color: colors.text,
            textAlign: 'right',
            flex: 1,
            paddingLeft: 16,
        },
        formButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.sectionBackground,
            borderRadius: 10,
            padding: 16,
            marginBottom: 24,
        },
        actionButton: {
            fontSize: 17,
            color: colors.tint,
        },
        emphasisButton: {
            fontSize: 17,
            color: colors.tint,
            fontWeight: '600',
        },
        iconContainer: {
            backgroundColor: colors.buttonBackground,
            borderRadius: 6,
            padding: 6,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        divider: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginHorizontal: 16,
        },
        textArea: {
            fontSize: 16,
            color: colors.text,
            minHeight: 120,
            textAlignVertical: 'top',
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
