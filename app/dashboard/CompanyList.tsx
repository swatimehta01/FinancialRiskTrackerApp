// app/dashboard/CompanyList.tsx

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const companies = [
  { name: 'Google', symbol: 'GOOGL' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Tata Motors', symbol: 'TTM' },
];

export default function CompanyList() {
  const router = useRouter();

  const handlePress = (company: any) => {
    router.push({
      pathname: './CompanyDetail',
      params: { company: JSON.stringify(company) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📋 Select a Company</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text style={styles.text}>{item.name} ({item.symbol})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  item: {
    padding: 15,
    backgroundColor: '#f0f4ff',
    marginVertical: 8,
    borderRadius: 10,
  },
  text: { fontSize: 18 },
});
