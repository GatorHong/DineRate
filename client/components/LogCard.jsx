import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

export default function LogCard({ log, placeholder = false }) {
  const { styles, colors } = useThemeStyles();
  const router = useRouter();

  if (placeholder) {
    return (
      <View style={[styles.card, { marginBottom: 12, opacity: 0.5 }]}>
        <View style={{ height: 24, backgroundColor: colors.border, borderRadius: 4, marginBottom: 8, width: '60%' }} />
        <View style={{ height: 16, backgroundColor: colors.border, borderRadius: 4, marginBottom: 8, width: '40%' }} />
        <View style={{ height: 16, backgroundColor: colors.border, borderRadius: 4, width: '30%' }} />
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
        backgroundColor: colors.cardBackground || '#1f1f1f',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
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
            top: 4,
            right: -4,
            padding: 6,
            zIndex: 1
          }}
        >
          <FontAwesome name="pencil" size={16} color={colors.icon} />
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.text, { fontWeight: 'bold', marginRight: 12 }]}>
            ⭐ {log.rating}
          </Text>
          <View style={{
            backgroundColor: colors.tint,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}>
            <Text style={{
              color: colors.buttonText,
              fontSize: 12,
              fontWeight: '600',
            }}>
              {log.logType}
            </Text>
          </View>
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
