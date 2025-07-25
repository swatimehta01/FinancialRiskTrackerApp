import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    // Add your logout logic here
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text style={[styles.heading, isDarkTheme && styles.darkText]}>Settings</Text>

      <View style={[styles.card, isDarkTheme && styles.darkCard]}>
        <Text style={[styles.optionText, isDarkTheme && styles.darkText]}>
          Enable Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={[styles.card, isDarkTheme && styles.darkCard]}>
        <Text style={[styles.optionText, isDarkTheme && styles.darkText]}>
          Dark Theme
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
        />
      </View>

      <TouchableOpacity
        style={[styles.card, styles.logoutCard]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 40,
    alignSelf: 'center',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  logoutCard: {
    backgroundColor: '#5dade2', // Light blue
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
