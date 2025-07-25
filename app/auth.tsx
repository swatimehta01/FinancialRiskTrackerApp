import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';

export default function Auth() {
  return (
    <>
      {/* 🔒 Hide the "Auth" header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Financial Tracker</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
          <Text style={styles.text}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold' },
  button: {
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // ✅ Bold text
  },
});
