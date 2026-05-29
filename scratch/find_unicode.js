const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Finding all \\u escapes in App.jsx:');
lines.forEach((line, idx) => {
  if (line.includes('\\u')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
