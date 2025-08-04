import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '../../../constants/Styles';
import { AuthContext } from '../../../context/AuthContext'; // adjust if needed
import api from '../../../services/api';

export default function AdminPanel() {
  const { styles, colors } = useThemeStyles();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Admin Panel</Text>

      {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={localStyles.card}>
            <Text style={localStyles.name}>{item.name} ({item.username})</Text>
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
