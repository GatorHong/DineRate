import { useThemeStyles } from '@/constants/Styles';
import { AuthContext } from '@/context/AuthContext';
import api from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';

export default function AdminPanel() {
  const { styles, colors } = useThemeStyles();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'admin', 'member'

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const changeUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      Toast.show('Role updated', { duration: Toast.durations.SHORT });
      fetchUsers();
    } catch (err) {
      Toast.show('Failed to update role', { duration: Toast.durations.SHORT });
    }
  };

  const toggleUserActive = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { active: !currentStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      Toast.show(`User ${!currentStatus ? 'enabled' : 'disabled'}`, { duration: Toast.durations.SHORT });
      fetchUsers();
    } catch (err) {
      Toast.show('Failed to toggle user status', { duration: Toast.durations.SHORT });
    }
  };

  const deleteUser = (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
              });
              Toast.show('User deleted', { duration: Toast.durations.SHORT });
              fetchUsers();
            } catch (err) {
              Toast.show('Failed to delete user', { duration: Toast.durations.SHORT });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredUsers = users.filter((u) =>
    filter === 'all' ? true : u.role?.toLowerCase() === filter
  );

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  return (
    <View style={[styles.screenContainer, { paddingTop: 16 }]}>
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
        <TouchableOpacity onPress={fetchUsers}>
          <Ionicons name="refresh" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
        {['all', 'admin', 'member'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type)}
            style={[
              localStyles.filterButton,
              { backgroundColor: filter === type ? colors.tint : colors.card },
            ]}
          >
            <Text style={{ color: filter === type ? 'white' : colors.text, fontSize: 12 }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error !== '' && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />}
        renderItem={({ item }) => (
          <View style={[localStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[localStyles.name, { color: colors.text }]}>
              {item.name} ({item.username})
            </Text>
            <Text style={{ color: colors.text, marginBottom: 6 }}>
              Role: {item.role} | Status: {item.active ? 'Active' : 'Disabled'}
            </Text>

            {/* Toggle Active */}
            <View style={localStyles.row}>
              <Text style={{ color: colors.text }}>Active:</Text>
              <Switch
                value={item.active}
                onValueChange={() => toggleUserActive(item._id, item.active)}
              />
            </View>

            {/* Role Switch & Delete */}
            <View style={localStyles.row}>
              <TouchableOpacity
                onPress={() =>
                  changeUserRole(item._id, item.role === 'admin' ? 'member' : 'admin')
                }
              >
                <Text style={{ color: colors.link }}>
                  Make {item.role === 'admin' ? 'Member' : 'Admin'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteUser(item._id)}>
                <Text style={{ color: 'red', marginLeft: 20 }}>Delete</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 12,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
