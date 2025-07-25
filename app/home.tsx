import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardPage from './dashboardPage';
import Settings from './setting'; // ✅ Your actual settings screen

const Tab = createBottomTabNavigator();

function Company() {
  const router = useRouter();

  const companies = [
    { name: 'Google', symbol: 'GOOGL', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Apple', symbol: 'AAPL', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'Zomato', symbol: 'ZOMATO.NS', logo: 'https://logo.clearbit.com/zomato.com' },
    { name: 'Tata Motors', symbol: 'TTM', logo: 'https://logo.clearbit.com/tatamotors.com' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📈 Select a company to invest</Text>
      <FlatList
        data={companies}
        numColumns={2}
        keyExtractor={(item) => item.symbol}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.companyCard}
            onPress={() =>
              router.push({
                pathname: '/dashboard/CompanyDetail',
                params: { company: JSON.stringify(item) },
              })
            }
          >
            <Image source={{ uri: item.logo }} style={styles.companyLogo} resizeMode="contain" />
            <Text style={styles.companyName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Portfolio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Portfolio') iconName = 'pie-chart';
          else if (route.name === 'Settings') iconName = 'cog';
          else if (route.name === 'Company') iconName = 'building';

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3F51B5',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F9F9F9',
          borderTopWidth: 0.5,
          borderTopColor: '#DDD',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Portfolio" component={DashboardPage} />
      <Tab.Screen name="Company" component={Company} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 30 : 60,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 30 : 60,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2C3E50',
  },
  button: {
    padding: 15,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#1A237E',
    fontWeight: '500',
  },
  simpleText: {
    fontSize: 16,
    color: '#333',
  },
  companyCard: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    flex: 0.48,
    elevation: 3,
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
