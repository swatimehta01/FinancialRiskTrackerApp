import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function CompanyDetail() {
  const params = useLocalSearchParams();

  let company = null;
  try {
    if (params.company && typeof params.company === 'string') {
      company = JSON.parse(params.company);
    }
  } catch (e) {
    console.error('❌ Invalid company param:', e);
  }

  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const baseURL = 'http://192.168.38.205:5000';

  useEffect(() => {
    if (!company?.symbol) return;

    const fetchData = async () => {
      try {
        const [infoRes, chartRes] = await Promise.all([
          fetch(`${baseURL}/company/${company.symbol}`),
          fetch(`${baseURL}/company/${company.symbol}/chart`),
        ]);

        const infoData = await infoRes.json();
        const chartJson = await chartRes.json();

        setCompanyData(infoData);
        setChartData(chartJson);

        setAiLoading(true);
        const aiRes = await fetch(`${baseURL}/explain-risk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: company.symbol,
            metrics: infoData?.metrics ?? {},
            industry: infoData?.finnhubIndustry ?? 'Unknown',
          }),
        });

        const aiJson = await aiRes.json();
        let explanation = '';

        if (typeof aiJson.explanation === 'string') {
          explanation = aiJson.explanation
            .replace(/(?<=^|\n)🛑.*?disclaimer.*?(\n|$)/gis, '')
            .replace(/(?<=^|\n)let.*?(google|apple|company).*?(\n|$)/gis, '')
            .replace(/(?<=^|\n)(important note|important:|disclaimer).*?(\n|$)/gis, '')
            .replace(/(\*\*Important Note:\*\*[\s\S]*)$/i, '')
            .replace(/\n{2,}/g, '\n\n')
            .trim();
        } else if (typeof aiJson.explanation === 'object') {
          explanation = JSON.stringify(aiJson.explanation, null, 2);
        } else {
          explanation = String(aiJson.explanation ?? '');
        }

        setAiExplanation(explanation);
      } catch (err) {
        console.error('❌ Error fetching company or AI data:', err);
        setError('Failed to load data.');
        setAiError('AI failed to respond.');
      } finally {
        setLoading(false);
        setAiLoading(false);
      }
    };

    fetchData();
  }, [company?.symbol]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`${baseURL}/download-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ explanation: aiExplanation }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PDF report');
      }

      const fileUri = FileSystem.documentDirectory + 'AI_Risk_Report.pdf';
      const downloadRes = await FileSystem.downloadAsync(
        `${baseURL}/ai_report.pdf`,
        fileUri
      );

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Info', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(downloadRes.uri);
    } catch (error) {
      console.error('❌ Download error:', error);
      Alert.alert('Error', 'Failed to download or share the report.');
    }
  };

  if (!company) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>❌ No company selected or invalid data.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  if (error || !companyData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error || 'Error loading data.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerSpace} />

      <Text style={styles.title}>📊 Company Risk Analysis</Text>

      <View style={styles.infoSection}>
        {companyData.logo && (
          <Image source={{ uri: companyData.logo }} style={styles.logo} />
        )}

        <Text style={styles.name}>{companyData.name ?? 'N/A'}</Text>
        <Text style={styles.subText}>Symbol: {companyData.ticker}</Text>
        <Text style={styles.subText}>Industry: {companyData.finnhubIndustry}</Text>
        <Text style={styles.subText}>Market Cap: {companyData.marketCapitalization} B</Text>
        <Text style={styles.subText}>IPO: {companyData.ipo}</Text>
        <Text style={styles.subText}>Exchange: {companyData.exchange}</Text>
      </View>

      <View style={styles.metricsCard}>
        <Text style={styles.cardTitle}>📈 Risk Metrics</Text>
        <Text>🔁 Beta: {companyData.metrics?.beta ?? 'N/A'}</Text>
        <Text>📉 Debt/Equity: {companyData.metrics?.debtToEquity ?? 'N/A'}</Text>
        <Text>📈 Revenue Growth: {companyData.metrics?.revenueGrowth ?? 'N/A'}</Text>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.cardTitle}>🧠 AI Risk Analysis</Text>
        {aiLoading ? (
          <ActivityIndicator color="#5C6BC0" size="small" />
        ) : aiError ? (
          <Text style={{ color: 'red' }}>{aiError}</Text>
        ) : (
          <>
            <Markdown style={markdownStyles}>{aiExplanation}</Markdown>

            <TouchableOpacity onPress={handleDownload} style={styles.downloadBtn}>
              <Text style={styles.downloadText}>⬇️ Download Report</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSpace: {
    height: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  metricsCard: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#d0f0c0',
    borderRadius: 10,
  },
  aiCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0d47a1',
  },
  downloadBtn: {
    marginTop: 15,
    backgroundColor: '#1A237E',
    padding: 10,
    borderRadius: 8,
  },
  downloadText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const markdownStyles = {
  body: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  strong: {
    fontWeight: '700' as const,
  },
  em: {
    fontStyle: 'italic' as const,
  },
  bullet_list: {
    marginTop: 10,
    marginBottom: 10,
  },
  list_item: {
    marginLeft: 10,
  },
};
