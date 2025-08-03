import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
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
            pathname: '/(tabs)/(Profile)/[logListType]/details/[id]', // same route, assume edit screen is same
            params: { logListType: log.logType, id: log._id, mode: 'edit' } // optionally pass mode param
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, { marginBottom: 12 }]}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <View style={{ flex: 1, position: 'relative' }}>
                {/* Edit button in top-right corner */}
                <TouchableOpacity
                    onPress={handleEdit}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: 8,
                        zIndex: 1
                    }}
                >
                    <FontAwesome name="pencil" size={24} color={colors.icon} />
                </TouchableOpacity>

                <Text style={[styles.title, { fontSize: 18, marginTop: 0 }]} numberOfLines={1}>
                    {log.title}
                </Text>
                <Text style={[styles.text, { marginBottom: 8, color: colors.icon }]} numberOfLines={2}>
                    {log.location}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={[styles.text, { fontWeight: 'bold', marginRight: 12 }]}>
                        ⭐ {log.rating}
                    </Text>
                    {log.tags?.length > 0 && (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
    {log.tags.map((tag, index) => (
      <Text
        key={index}
        style={{
          marginRight: 6,
          marginBottom: 4,
          paddingHorizontal: 8,
          paddingVertical: 2,
          backgroundColor: colors.border,
          color: colors.text,
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {tag}
      </Text>
    ))}
  </View>
)}

                    <Text style={[styles.text, { backgroundColor: colors.tint, color: colors.buttonText, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12 }]}>
                        {log.logType}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
