const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');

const url = 'https://alighadrboland.github.io/Gold-Porfolio/';

https.get(url, res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    const $ = cheerio.load(data);
    const combined = $('#combined-value').text().trim();

    if (combined) {
      const now = new Date().toISOString().slice(0, 10);
      const row = `${now},${combined}\n`;

      const file = 'log.csv';
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, 'date,combined\n');
      }

      const currentData = fs.readFileSync(file, 'utf8');
      if (!currentData.includes(now)) {
        fs.appendFileSync(file, row);
        console.log(`✅ Logged: ${row}`);
      } else {
        console.log(`ℹ️ Already logged for ${now}`);
      }
    } else {
      console.error('❌ Could not find combined value in HTML');
      process.exit(1);
    }
  });
}).on('error', err => {
  console.error('❌ Error fetching data:', err.message);
  process.exit(1);
});