import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

const BackgroundPattern = ({
  opacity = 0.075,
  spacing = 20,
  dotSize = 3,
  speed = 500,
  blurHeight = 40
}) => {
  const { colors } = useThemeStyles();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAndStartAnimation = () => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -spacing,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -spacing,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ]).start(({ finished }) => {
        if (finished) {
          translateX.setValue(0);
          translateY.setValue(0);
          createAndStartAnimation();
        }
      });
    };

    translateX.setValue(0);
    translateY.setValue(0);
    createAndStartAnimation();

    return () => {
      translateX.stopAnimation();
      translateY.stopAnimation();
    };
  }, [spacing, speed]);

  const renderPattern = () => {
    const { width, height } = Dimensions.get('window');
    const extraDots = 8;

    const horizontalCount = Math.ceil(width / spacing) + extraDots;
    const verticalCount = Math.ceil(height / spacing) + extraDots;

    const dots = [];

    for (let i = -extraDots/2; i < horizontalCount; i++) {
      for (let j = -extraDots/2; j < verticalCount; j++) {
        dots.push(
          <View
            key={`dot-${i}-${j}`}
            style={[
              styles.dot,
              {
                left: i * spacing,
                top: j * spacing,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: colors.text,
                opacity,
              },
            ]}
          />
        );
      }
    }

    return dots;
  };

  // Create correct gradient colors based on the current theme background
  const getGradientColors = (direction) => {
    // Use ONLY the background color with varying opacity levels
    const transparentBackground = `${colors.background}00`; // Completely transparent
    const mediumBackground = `${colors.background}90`;      // Medium opacity
    const fullBackground = colors.background;               // Full opacity

    switch(direction) {
      case 'top':
      case 'left':
        return [fullBackground, mediumBackground, transparentBackground];
      case 'bottom':
      case 'right':
        return [transparentBackground, mediumBackground, fullBackground];
      default:
        return [transparentBackground, mediumBackground, fullBackground];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.patternContainer,
          {
            transform: [
              { translateX },
              { translateY },
            ],
          },
        ]}
      >
        {renderPattern()}
      </Animated.View>

      {/* Top blur */}
      <LinearGradient
        colors={getGradientColors('top')}
        style={[styles.blurGradient, styles.topBlur, { height: blurHeight }]}
        pointerEvents="none"
      />

      {/* Bottom blur */}
      <LinearGradient
        colors={getGradientColors('bottom')}
        style={[styles.blurGradient, styles.bottomBlur, { height: blurHeight }]}
        pointerEvents="none"
      />

      {/* Left blur */}
      <LinearGradient
        colors={getGradientColors('left')}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.blurGradient, styles.leftBlur, { width: blurHeight }]}
        pointerEvents="none"
      />

      {/* Right blur */}
      <LinearGradient
        colors={getGradientColors('right')}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.blurGradient, styles.rightBlur, { width: blurHeight }]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
  },
  blurGradient: {
    position: 'absolute',
    zIndex: 10,
  },
  topBlur: {
    top: 0,
    left: 0,
    right: 0,
  },
  bottomBlur: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  leftBlur: {
    left: 0,
    top: 0,
    bottom: 0,
  },
  rightBlur: {
    right: 0,
    top: 0,
    bottom: 0,
  }
});

export default BackgroundPattern;