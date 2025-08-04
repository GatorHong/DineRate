import { useThemeStyles } from '@/constants/Styles';
import { AuthContext } from '@/context/AuthContext';
import api from '@/services/api';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function AdminPanel() {
  const { styles } = useThemeStyles();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [user]);

  // ✅ Fetch users only if admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    if (user?.role?.toLowerCase() === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Admin Panel</Text>

      {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={localStyles.card}>
            <Text style={localStyles.name}>
              {item.name} ({item.username})
            </Text>
            <Text style={localStyles.role}>Role: {item.role}</Text>
          </View>
        )}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  role: {
    color: 'gray',
  },
});
