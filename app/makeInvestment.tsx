// screens/MakeInvestment.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MakeInvestment = () => {
  const [amount, setAmount] = useState('');
  const [risk, setRisk] = useState('');
  const [sector, setSector] = useState('');
  const [recommendations, setRecommendations] = useState<any[] | null>(null);

  const handleInvestment = () => {
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid investment amount.');
      return;
    }

    if (!risk || !sector) {
      alert('Please fill all fields.');
      return;
    }

    // Simulated logic for recommendation
    const mockData = [
      { name: 'Tata Consultancy Services', sector: 'tech', amount: (amt * 0.4).toFixed(2) },
      { name: 'Sun Pharma', sector: 'pharma', amount: (amt * 0.3).toFixed(2) },
      { name: 'Infosys', sector: 'tech', amount: (amt * 0.3).toFixed(2) },
    ];

    setRecommendations(mockData.filter(item => item.sector === sector || sector === 'any'));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Make a New Investment</Text>

        <Text style={styles.label}>Investment Amount (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 400"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Risk Appetite</Text>
        <Picker
          selectedValue={risk}
          onValueChange={(value) => setRisk(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select risk" value="" />
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>

        <Text style={styles.label}>Sector Preference</Text>
        <Picker
          selectedValue={sector}
          onValueChange={(value) => setSector(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select sector" value="" />
          <Picker.Item label="Any" value="any" />
          <Picker.Item label="Tech" value="tech" />
          <Picker.Item label="Pharma" value="pharma" />
          <Picker.Item label="Finance" value="finance" />
        </Picker>

        <View style={styles.buttonContainer}>
          <Button title="Get Investment Plan" onPress={handleInvestment} />
        </View>

        {recommendations && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>📊 Suggested Companies:</Text>
            {recommendations.map((item, index) => (
              <Text key={index} style={styles.resultItem}>
                {item.name} - ₹{item.amount}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MakeInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 25,
  },
  result: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#eef',
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
