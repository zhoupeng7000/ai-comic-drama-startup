const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'scratch') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('\\u') && !line.includes('SIMULATED_RESPONSE') && !line.includes('SYSTEM_PROMPT')) {
          console.log(`${path.relative(path.join(__dirname, '..'), fullPath)} Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

console.log('Searching all files for \\u escapes:');
searchDir(path.join(__dirname, '..'));
