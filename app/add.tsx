import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // 👈 Import Auth
import { db } from '../FirebaseConfig'; // 🔥 Update path if needed

export default function AddInvestment() {
  const [symbol, setSymbol] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyDate, setBuyDate] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!symbol || !buyPrice || !quantity || !buyDate) {
      Alert.alert('Please fill all fields');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('You must be logged in to save investments.');
      return;
    }

    try {
      await addDoc(collection(db, 'investments'), {
        symbol: symbol.trim().toUpperCase(),
        buyPrice: parseFloat(buyPrice),
        quantity: parseFloat(quantity),
        buyDate,
        createdAt: serverTimestamp(),
        userId: user.uid // 👈 Add userId to investment
      });

      Alert.alert('Investment saved!');
      router.back();
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      Alert.alert('Failed to save. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Add Investment</Text>

      <TextInput
        placeholder="Stock Symbol (e.g., AAPL)"
        style={styles.input}
        value={symbol}
        onChangeText={setSymbol}
      />
      <TextInput
        placeholder="Buy Price"
        style={styles.input}
        keyboardType="numeric"
        value={buyPrice}
        onChangeText={setBuyPrice}
      />
      <TextInput
        placeholder="Quantity"
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        placeholder="Buy Date (YYYY-MM-DD)"
        style={styles.input}
        value={buyDate}
        onChangeText={setBuyDate}
      />

      <Button title="💾 Save Investment" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A237E',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
