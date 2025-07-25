import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

interface Investment {
  symbol: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
  userId: string;
  createdAt: any;
}

const screenWidth = Dimensions.get('window').width;

export default function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [dailyValues, setDailyValues] = useState<number[]>([]);
  const [gainLossTrend, setGainLossTrend] = useState<number[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const totalInvestment = investments.reduce(
    (sum, i) => sum + i.quantity * i.buyPrice,
    0
  );
  const totalHoldings = investments.length;
  const portfolioValue = dailyValues[dailyValues.length - 1] || 0;

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn('User not authenticated');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'investments'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedInvestments: Investment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedInvestments.push(doc.data() as Investment);
      });

      setInvestments(fetchedInvestments);
      generateMockChartData(fetchedInvestments);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to investments:', error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const generateMockChartData = (inv: Investment[]) => {
    const days = 7;

    const mockDaily = Array.from({ length: days }, (_, i) => {
      const total = inv.reduce((sum, inv) => {
        const base = inv.quantity * inv.buyPrice;
        return sum + base * (1 + Math.sin(i / 2 + inv.quantity) * 0.05);
      }, 0);
      return Math.round(total);
    });

    const gainLoss = mockDaily.map((val, idx, arr) => {
      if (idx === 0 || arr[idx - 1] === 0) return 0;
      const change = ((val - arr[idx - 1]) / arr[idx - 1]) * 100;
      return isFinite(change) ? Math.round(change) : 0;
    });

    const pie = inv.map((item, idx) => {
      const value = item.quantity * item.buyPrice;
      return {
        name: item.symbol,
        population: isFinite(value) ? value : 0,
        color: chartColors[idx % chartColors.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      };
    });

    setDailyValues(mockDaily);
    setGainLossTrend(gainLoss);
    setPieData(pie);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeBox}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          “Track. Grow. Relax.” Your money, your future.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        <View style={[styles.sliderCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.sliderLabel}>🪙 Total Investment</Text>
          <Text style={styles.sliderValue}>₹ {totalInvestment.toFixed(2)}</Text>
        </View>
        <View style={[styles.sliderCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.sliderLabel}>💼 Portfolio Value</Text>
          <Text style={styles.sliderValue}>₹ {portfolioValue}</Text>
        </View>
        <View style={[styles.sliderCard, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.sliderLabel}>📦 Holdings</Text>
          <Text style={styles.sliderValue}>{totalHoldings}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add')}>
        <Text style={styles.addButtonText}>Add Previous Investment</Text>
      </TouchableOpacity>

      {/* ✅ New Button: Make New Investment */}
      <TouchableOpacity style={styles.newButton} onPress={() => router.push('./makeInvestment')}>
        <Text style={styles.newButtonText}> Make New Investment</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.header}>📈 Daily Portfolio Value</Text>
        <LineChart
          data={{
            labels: ['Day 1', '2', '3', '4', '5', '6', 'Today'],
            datasets: [{ data: dailyValues }],
          }}
          width={screenWidth - 40}
          height={160}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>📉 Gain / Loss Trend (%)</Text>
        <LineChart
          data={{
            labels: ['Day 1', '2', '3', '4', '5', '6', 'Today'],
            datasets: [{ data: gainLossTrend }],
          }}
          width={screenWidth - 40}
          height={160}
          chartConfig={chartConfigRedGreen}
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>🥧 Asset Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
}

const chartColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#FF9800'];

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 200, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const chartConfigRedGreen = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  welcomeBox: {
    marginBottom: 10,
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
    marginBottom: 15,
  },
  slider: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sliderCard: {
    borderRadius: 14,
    padding: 18,
    marginRight: 12,
    width: 200,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#fff',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
});
