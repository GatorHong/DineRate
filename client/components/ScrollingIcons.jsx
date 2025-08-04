import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const IconScroller = ({ colors }) => {
  // Base set of icons
  const baseIcons = [
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

  // Create three sets of icons for proper infinite scrolling
  const icons = [...baseIcons, ...baseIcons, ...baseIcons];

  const scrollViewRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  // Handle content size change
  const handleContentSizeChange = (width) => {
    setContentWidth(width);
    setSingleSetWidth(width / 3);
  };

  useEffect(() => {
    // Initialize scroll position to the middle set
    if (singleSetWidth > 0) {
      scrollViewRef.current?.scrollTo({
        x: singleSetWidth,
        animated: false
      });
    }
  }, [singleSetWidth]);

  useEffect(() => {
    let scrollAnimation;
    let startTime = Date.now();
    let initialPosition = singleSetWidth;
    const scrollDuration = 30000;

    // Only start animation when we have valid measurements
    if (singleSetWidth > 0) {
      const scroll = () => {
        const elapsedTime = Date.now() - startTime;
        const scrollDistance = (elapsedTime / scrollDuration) * singleSetWidth;
        const newPosition = initialPosition + scrollDistance;

        // Check if we need to reset
        if (newPosition >= singleSetWidth * 2) {
          // Jump back to the middle set (equivalent position)
          const offset = newPosition - singleSetWidth * 2;
          initialPosition = singleSetWidth + offset;
          startTime = Date.now();
          scrollViewRef.current?.scrollTo({
            x: initialPosition,
            animated: false
          });
        } else {
          // Normal scrolling
          scrollViewRef.current?.scrollTo({
            x: newPosition,
            animated: false
          });
        }

        scrollAnimation = requestAnimationFrame(scroll);
      };

      scrollAnimation = requestAnimationFrame(scroll);
    }

    return () => {
      if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
      }
    };
  }, [singleSetWidth]);

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
        scrollEnabled={false}
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
    marginHorizontal: -24,
  },
  iconScrollContent: {
    paddingHorizontal: 0,
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