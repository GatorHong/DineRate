import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

export default function LogCard({ log }) {
    const { styles, colors } = useThemeStyles();
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/(tabs)/(Profile)/[logListType]/details/[id]',
            params: { logListType: log.logType, id: log._id }
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
                    <Text style={[styles.text, { backgroundColor: colors.tint, color: colors.buttonText, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12 }]}>
                        {log.logType}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
