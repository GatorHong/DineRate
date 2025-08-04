import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

export default function LogCard({ log, placeholder = false }) {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

    if (placeholder) {
        return (
            <View
                style={{
                    backgroundColor: colors.sectionBackground,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: 0.7
                }}
            >
                {/* Left section with placeholder text content */}
                <View style={{ flex: 1, paddingRight: 10 }}>
                    {/* Title placeholder */}
                    <View style={{ height: 18, backgroundColor: colors.border, borderRadius: 4, marginBottom: 8, width: '70%' }} />

                    {/* Location placeholder */}
                    <View style={{ height: 16, backgroundColor: colors.border, borderRadius: 4, marginBottom: 12, width: '50%' }} />

                    {/* Rating placeholders */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ height: 16, backgroundColor: colors.border, borderRadius: 4, width: 40 }} />
                        <View style={{ height: 16, backgroundColor: colors.border, borderRadius: 4, width: 40 }} />
                    </View>
                </View>

                {/* Right-side thumbnail image placeholder */}
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        marginLeft: 10,
                        backgroundColor: colors.border
                    }}
                />
            </View>
        );
    }

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/(Profile)/[logListType]/details/[id]',
      params: { logListType: log.logType, id: log._id, title: log.title }
    });
  };

  const handleEdit = () => {
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
      activeOpacity={0.9}
    >
      {/* Left section with text content */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        {/* Edit icon */}
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

        {/* Title */}
        <Text style={[styles.title, { fontSize: 18, marginBottom: 4 }]} numberOfLines={1}>
          {log.title}
        </Text>

        {/* Location */}
        <Text style={[styles.text, { color: colors.icon, marginBottom: 10 }]} numberOfLines={1}>
          {log.location}
        </Text>

        {/* Rating and Log Type */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  {/* Your Rating */}
  {log.rating != null && !isNaN(log.rating) && (
    <Text style={[styles.text, { fontWeight: 'bold' }]}>
      ⭐ {Number(log.rating).toFixed(1)}
    </Text>
  )}

  {/* Google Rating */}
  {log.googleRating != null && !isNaN(log.googleRating) && (
    <Text style={[styles.text, { fontWeight: 'bold', color: colors.text }]}>
      🌐 {Number(log.googleRating).toFixed(1)}
    </Text>
  )}
        </View>
      </View>

      {/* Right-side thumbnail image */}
      {log.photoUrl && (
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
    </TouchableOpacity>
  );
}
