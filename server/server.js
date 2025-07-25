const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateReportFile } = require('./generateReport'); // ✅ changed import
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 API Keys
 const FINNHUB_API_KEY = 'd1hh661r01qsvr2a5hlgd1hh661r01qsvr2a5hm0';
 const GEMINI_API_KEY = 'AIzaSyBv9bqZ8dp0W6B9iBPp4w-hxwudcG5QHwM';


// 🔌 Gemini setup
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 🔹 GET: Company profile + metrics
app.get('/company/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const [profileRes, metricsRes] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
      axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`),
    ]);

    res.json({
      ...profileRes.data,
      metrics: metricsRes.data.metric,
    });
  } catch (err) {
    console.error('❌ Error fetching company data:', err.message);
    res.status(500).json({ error: 'Error fetching company data' });
  }
});

// 🔹 GET: Chart data
app.get('/company/:symbol/chart', async (req, res) => {
  const { symbol } = req.params;

  try {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    if (!data || typeof data.o !== 'number') {
      throw new Error('Invalid quote data from Finnhub');
    }

    const chartData = [
      { x: 'Open', y: data.o },
      { x: 'High', y: data.h },
      { x: 'Low', y: data.l },
      { x: 'Current', y: data.c },
    ];

    res.json(chartData);
  } catch (err) {
    console.warn('⚠️ Falling back to dummy chart due to error:', err.message);
    res.status(500).json({ error: 'Failed to fetch quote data.' });
  }
});

// 🔹 POST: AI Risk Explanation (Gemini)
app.post('/explain-risk', async (req, res) => {
  const { symbol, metrics = {}, industry } = req.body;

  const prompt = `
You are a financial advisor AI. Analyze this company:

- Symbol: ${symbol}
- Beta (volatility): ${metrics.beta}
- Debt/Equity ratio: ${metrics.debtToEquity}
- Revenue growth: ${metrics.revenueGrowth}
- Industry: ${industry}

1. Explain in simple terms why this company may be risky.
2. Suggest 2–3 actions an investor could take to reduce that risk.
3. Keep it beginner-friendly.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    const text = await response.text();

    res.json({ explanation: text.trim() });
  } catch (err) {
    console.error('❌ Gemini AI Error:', err.message);
    res.status(500).json({
      explanation: '⚠️ AI explanation unavailable. Please try again later.',
    });
  }
});

// 🔹 POST: Generate PDF and return for download
app.post('/download-report', async (req, res) => {
  const { explanation, symbol } = req.body;

  if (!explanation || !symbol) {
    return res.status(400).json({ error: 'Explanation and symbol are required' });
  }

  try {
    const filePath = await generateReportFile(explanation, symbol);
    const fileName = path.basename(filePath);

    res.json({ fileName }); // client will download via /reports/<fileName>
  } catch (err) {
    console.error('❌ Error generating report:', err.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});


// ✅ Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
