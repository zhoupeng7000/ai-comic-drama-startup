const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');

try {
  let content = fs.readFileSync(appPath, 'utf8');

  // Locate "</header>"
  const headerEndTag = "</header>";
  const headerIdx = content.indexOf(headerEndTag);
  if (headerIdx === -1) {
    console.error("Error: Could not find </header>");
    process.exit(1);
  }

  // Locate "<main className={scenes.length ==="
  const mainTag = '<main className={scenes.length === 0 ? "wizard-dashboard-layout"';
  const mainIdx = content.indexOf(mainTag);
  if (mainIdx === -1) {
    console.error("Error: Could not find main tag start");
    process.exit(1);
  }

  // Find the end of the main tag declaration (closing '>')
  const mainEndIdx = content.indexOf('>', mainIdx);
  if (mainEndIdx === -1) {
    console.error("Error: Could not find end of main tag");
    process.exit(1);
  }

  const beforeHeader = content.substring(0, headerIdx + headerEndTag.length);
  const afterMain = content.substring(mainEndIdx + 1);

  const newMainTag = '\n\n      <main className={scenes.length === 0 ? "wizard-dashboard-layout" : "dashboard-grid"}>';

  const newContent = beforeHeader + newMainTag + afterMain;

  fs.writeFileSync(appPath, newContent, 'utf8');
  console.log("App.jsx cleaned up successfully via Node!");
} catch (err) {
  console.error("Error during cleanup:", err);
  process.exit(1);
}
