const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/alighadrboland/Gold-Porfolio/refs/heads/main/index.html';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const regex = /combined\s*=\s*([\d.]+)/;
      const match = data.match(regex);
      if (match && match[1]) {
        const combined = parseFloat(match[1]);
        const now = new Date().toISOString().slice(0, 10);
        const row = `${now},${combined}\n`;
        if (!fs.existsSync('log.csv') || !fs.readFileSync('log.csv').includes(now)) {
              fs.appendFileSync('log.csv', row);
              console.log(`✅ Logged: ${row}`);
        } else {
              console.log(`ℹ️ Already logged for ${now}`);
        }
    } catch (err) {
      console.error('❌ خطا در پردازش داده:', err);
    }
  });
}).on('error', (err) => {
  console.error('❌ خطا در دریافت HTML:', err);
});
