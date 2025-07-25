// app/layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext'; // adjust path if needed

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
