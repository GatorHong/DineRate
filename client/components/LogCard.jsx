import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

export default function LogCard({ log, placeholder = false }) {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

  const handlePress = () => {
    if (placeholder) return;
    router.push({
      pathname: '/(tabs)/(Profile)/[logListType]/details/[id]',
      params: { logListType: log.logType, id: log._id, title: log.title }
    });
  };

  const handleEdit = () => {
    if (placeholder) return;
    router.push({
      pathname: '/(tabs)/(Profile)/[logListType]/details/[id]',
      params: { logListType: log.logType, id: log._id, mode: 'edit' }
    });
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.sectionBackground,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={handlePress}
      activeOpacity={placeholder ? 1 : 0.4}
    >
      {/* Left section with text content */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        {/* Edit icon */}
        {!placeholder && (
          <TouchableOpacity
            onPress={handleEdit}
            style={{
              position: 'absolute',
              top : -10,
              right: -10,
              padding: 6,
              zIndex: 1,
              backgroundColor : colors.background,
              borderRadius: 10,
            }}
          >
            <Ionicons name="pencil" size={16} color={colors.icon} />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={[styles.title, { fontSize: 18, marginBottom: 4 }]} numberOfLines={1}>
          {placeholder ? "Placeholder Title" : log.title}
        </Text>

        {/* Location */}
        <Text style={[styles.text, { color: colors.icon, marginBottom: 10 }]} numberOfLines={1}>
          {placeholder ? "Placeholder Location" : log.location}
        </Text>

        {/* Rating and Log Type */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Your Rating */}
          {!placeholder && log.rating != null && !isNaN(log.rating) && (
            <Text style={[styles.text, { fontWeight: 'bold' }]}>
              ⭐ {Number(log.rating).toFixed(1)}
            </Text>
          )}

          {/* Google Rating */}
          {!placeholder && log.googleRating != null && !isNaN(log.googleRating) && (
            <Text style={[styles.text, { fontWeight: 'bold', color: colors.text }]}>
              🌐 {Number(log.googleRating).toFixed(1)}
            </Text>
          )}

          {/* Placeholder ratings */}
          {placeholder && (
            <Text style={[styles.text, { fontWeight: 'bold' }]}>⭐ -.-</Text>
          )}
        </View>
      </View>

      {/* Right-side thumbnail image */}
      {!placeholder && log.photoUrl && (
        <Image
          source={{ uri: log.photoUrl }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            marginLeft: 10,
          }}
          resizeMode="cover"
        />
      )}
      {placeholder && (
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            marginLeft: 10,
            backgroundColor: colors.icon,
            opacity: 0.3
          }}
        />
      )}
    </TouchableOpacity>
  );
}
