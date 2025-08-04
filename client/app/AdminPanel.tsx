import ConfirmModal from '@/components/ConfirmModal';
import { useThemeStyles } from '@/constants/Styles';
import { AuthContext } from '@/context/AuthContext';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminPanel() {
  const { styles } = useThemeStyles();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [logLoading, setLogLoading] = useState(false);

  // ✅ Redirect non-admins
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch {
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

  const handleFilter = (type) => {
    setFilter(type);
  };

  const filteredUsers = users.filter((u) => {
    const role = u.role?.toLowerCase();
    const matchesRole =
      filter === 'all' ||
      (filter === 'admin' && role === 'admin') ||
      (filter === 'member' && role !== 'admin');
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handlePromoteDemote = async (id, newRole) => {
    try {
      await api.put(
        `/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchUsers();
    } catch (err) {
      setError('Failed to update role');
    }
    setModalVisible(false);
  };

  const handleUserPress = async (item) => {
    setLogLoading(true);
    setSelectedUser(item);
    try {
      const res = await api.get(`/logs/user/${item._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLogs(res.data);
      setLogModalVisible(true);
    } catch (err) {
      setError('Failed to load user logs');
    } finally {
      setLogLoading(false);
    }
  };

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={local.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
        <TouchableOpacity onPress={fetchUsers}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filters + Search */}
      <View style={local.filterRow}>
        {['all', 'admin', 'member'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              local.filterButton,
              filter === type && { backgroundColor: '#007aff' },
            ]}
            onPress={() => handleFilter(type)}
          >
            <Text style={{ color: 'white', textTransform: 'capitalize' }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Search users..."
        placeholderTextColor="#ccc"
        style={local.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={local.card}
            onPress={() => handleUserPress(item)}
            onLongPress={() => {
              setSelectedUser(item);
              setModalVisible(true);
            }}
          >
            <Text style={local.name}>
              {item.name} ({item.username})
            </Text>
            <Text style={local.role}>Role: {item.role}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Confirm Modal for Promote/Demote */}
      <ConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() =>
          handlePromoteDemote(
            selectedUser._id,
            selectedUser.role === 'admin' ? 'member' : 'admin'
          )
        }
        message={`Are you sure you want to ${
          selectedUser?.role === 'admin' ? 'demote' : 'promote'
        } this user?`}
      />

      {/* Log Modal */}
      <Modal visible={logModalVisible} animationType="slide">
        <View style={styles.screenContainer}>
          <View style={local.header}>
            <TouchableOpacity onPress={() => setLogModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedUser?.name}'s Logs
            </Text>
          </View>
          {logLoading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : (
            <ScrollView>
              <Text style={local.logHeader}>To Dine</Text>
              {logs.toDine?.map((item, index) => (
                <Text key={index} style={styles.text}>
                  - {item.title}
                </Text>
              ))}
              <Text style={local.logHeader}>Dined</Text>
              {logs.dined?.map((item, index) => (
                <Text key={index} style={styles.text}>
                  - {item.title}
                </Text>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const local = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  searchInput: {
    backgroundColor: '#222',
    color: 'white',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#111',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  role: {
    color: 'gray',
  },
  logHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: 'white',
  },
});
