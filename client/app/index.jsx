import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStyles } from '../constants/Styles';

export default function Index() {
  const router = useRouter();
  const { styles, colors } = useThemeStyles();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Ionicons name="restaurant-outline" size={100} color={colors.tint} />
        <Text style={[styles.title, { marginVertical: 20 }]}>Welcome to DineRate</Text>
        <Text style={[styles.text, { textAlign: 'center', marginBottom: 30 }]}>
          Discover, track, and review your favorite dining experiences.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/Login')}
          style={[styles.buttonContainer, { marginBottom: 15 }]}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => router.push('/Register')}
            style={[styles.buttonContainer]}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
