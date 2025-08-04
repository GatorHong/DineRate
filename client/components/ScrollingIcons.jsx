import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Remove "const" from the export default
const IconScroller = ({ colors }) => {
    // App-relevant icons from Ionicons - duplicated to create an endless scroll effect
    const icons = [
        "restaurant-outline",
        "fast-food-outline",
        "cart-outline",
        "bicycle-outline",
        "location-outline",
        "time-outline",
        "calendar-outline",
        "card-outline",
        "document-text-outline",
        "receipt-outline",
        "people-outline",
        "chatbubble-outline",
        // Duplicate icons for seamless scrolling
        "restaurant-outline",
        "fast-food-outline",
        "cart-outline",
        "bicycle-outline",
        "location-outline",
        "time-outline",
        "calendar-outline",
        "card-outline",
        "document-text-outline",
        "receipt-outline",
        "people-outline",
        "chatbubble-outline"
    ];

    const scrollViewRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);

    useEffect(() => {
        let scrollAnimation;

        // Start auto-scrolling after getting content width
        if (contentWidth > 0) {
            let currentScrollPos = 0;
            const scrollDuration = 60000; // 60 seconds for one complete scroll

            const startTime = Date.now();

            const scroll = () => {
                const elapsedTime = Date.now() - startTime;
                const halfSetWidth = contentWidth / 2; // Half because we duplicated the icons

                // Calculate position based on elapsed time
                currentScrollPos = (elapsedTime / scrollDuration) * halfSetWidth;

                // Reset when we've scrolled through the first set of icons
                if (currentScrollPos >= halfSetWidth) {
                    currentScrollPos = 0;
                    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
                } else {
                    scrollViewRef.current?.scrollTo({ x: currentScrollPos, animated: false });
                }

                scrollAnimation = requestAnimationFrame(scroll);
            };

            scrollAnimation = requestAnimationFrame(scroll);
        }

        // Cleanup animation on unmount
        return () => {
            if (scrollAnimation) {
                cancelAnimationFrame(scrollAnimation);
            }
        };
    }, [contentWidth]);

    const handleContentSizeChange = (width) => {
        setContentWidth(width);
    };

    return (
        <View style={styles.scrollContainer}>
            <LinearGradient
                colors={[
                    colors.background,
                    `${colors.background}50`,
                    `${colors.background}00`
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.1, y: 0.5 }}
                style={styles.leftGradient}
                pointerEvents="none"
            />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false} // Disable manual scrolling
                contentContainerStyle={styles.iconScrollContent}
                onContentSizeChange={handleContentSizeChange}
            >
                {icons.map((iconName, index) => (
                    <View
                        key={index}
                        style={[
                            styles.iconContainer,
                            { backgroundColor: colors.sectionBackground }
                        ]}
                    >
                        <Ionicons
                            name={iconName}
                            size={60}
                            color={colors.icon}
                        />
                    </View>
                ))}
            </ScrollView>

            <LinearGradient
                colors={[
                    `${colors.background}00`,
                    `${colors.background}50`,
                    colors.background
                ]}
                start={{ x: 0.9, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.rightGradient}
                pointerEvents="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        height: 120,
        width: '100%',
        position: 'relative',
        marginHorizontal: -24, // Extend beyond the screen container padding
    },
    iconScrollContent: {
        paddingHorizontal: 0, // Remove horizontal padding
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    leftGradient: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 600,
        zIndex: 1,
    },
    rightGradient: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 600,
        zIndex: 1,
    }
});

export default IconScroller;