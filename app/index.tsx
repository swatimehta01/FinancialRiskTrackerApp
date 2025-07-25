// app/index.tsx
import { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';

export default function IndexPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hide the header (page title "index") */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Financial Tracker</Text>
        <Text style={styles.subtitle}>Your Smart Investment Partner</Text>
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold', // ✅ Bold subtitle
    color: '#333',
  },
});
