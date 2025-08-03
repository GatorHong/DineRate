// app/(tabs)/(Profile)/[logListType]/details/[id].jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import LogForm from '../../../../../components/LogForm';
import { useThemeStyles } from '../../../../../constants/Styles';
import api from '../../../../../services/api';

export default function DetailsScreen() {
  const { id, mode, title } = useLocalSearchParams();
  const isEditMode = mode === 'edit';
  const navigation = useNavigation();
  const { styles, colors } = useThemeStyles();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            title: title || 'Log',
            headerShown: true,
            headerStyle: {
                backgroundColor: colors.background, // fixes white header
            },
            headerTintColor: colors.text, // optional: sets title/icon color
        });
    }, [navigation, title, colors]);

    useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await api.get(`/logs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLog(res.data);
      } catch (err) {
        console.error('❌ Error fetching log:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id, navigation]);

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!log) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.text}>Log not found.</Text>
      </View>
    );
  }

  return isEditMode ? (
    <LogForm
      mode="edit"
      initialData={log}
      logId={id}
      onSaved={() => navigation.goBack()}
      onCancel={() => navigation.goBack()}
    />
  ) : (
    <View style={[styles.screenContainer, { padding: 16 }]}>
  {/* 🖼️ Restaurant Image */}
  {log.photoUrl && (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 16,
      }}
    >
      <Image
        source={{ uri: log.photoUrl }}
        style={{
          width: '100%',
          height: 220,
        }}
        resizeMode="cover"
      />
    </View>
  )}

  {/* 🍴 Title */}
  <Text style={[styles.title, { fontSize: 22, marginBottom: 8 }]}>
    🍴 {log.title}
  </Text>

  {/* 📍 Location & Date */}
  <View style={{ marginBottom: 12 }}>
    <Text style={[styles.text, { color: colors.icon }]}>
      📍 {log.location}
    </Text>
    <Text style={[styles.text, { color: colors.icon }]}>
      🕒 {new Date(log.createdAt).toLocaleString()}
    </Text>
  </View>

  {/* 🪟 Description (Styled Quote) */}
  {log.description && (
    <View
      style={{
        backgroundColor: colors.sectionBackground,
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <Text style={[styles.text, { fontStyle: 'italic', fontSize: 16 }]}>
        “{log.description}”
      </Text>
    </View>
  )}

  {/* 🍽️ Info Block */}
  <View
    style={{
      backgroundColor: '#262626',
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
    }}
  >
    <Text style={styles.text}>🍔 Food: <Text style={{ color: '#FFD580' }}>{log.food}</Text></Text>
    <Text style={styles.text}>⭐ Rating: <Text style={{ color: '#FFD700' }}>{log.rating}</Text></Text>
    <Text style={styles.text}>🔒 Visibility: <Text style={{ color: '#FF7F50' }}>{log.visibility}</Text></Text>
    <Text style={styles.text}>📂 Category: <Text style={{ color: '#87CEEB' }}>{log.logType}</Text></Text>
  </View>

  {/* 🏷️ Tags */}
  {log.tags?.length > 0 && (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.text, { marginBottom: 6 }]}>🏷️ Tags:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {log.tags.map((tag, index) => (
          <Text
            key={index}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
              backgroundColor: '#ffb347',
              color: '#1a1a1a',
              fontSize: 13,
              marginRight: 8,
              marginBottom: 6,
            }}
          >
            #{tag}
          </Text>
        ))}
      </View>
    </View>
  )}
</View>
  );
}