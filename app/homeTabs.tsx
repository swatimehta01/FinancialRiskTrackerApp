import React from 'react';
import { Stack } from 'expo-router';
import HomeTabs from './home'; // Adjust path if needed

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeTabs />
    </>
  );
}
