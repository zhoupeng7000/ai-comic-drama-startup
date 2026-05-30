const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');

try {
  let content = fs.readFileSync(appPath, 'utf8');

  const startMarker = '{/* 角色演员档案舱 (Cast Profile Manager) */}';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.error("Error: Could not find cast panel start marker");
    process.exit(1);
  }

  const endMarker = '{/* 素材指引 (Asset Cosmos Panel) */}';
  const endIdx = content.indexOf(endMarker);
  if (endIdx === -1) {
    console.error("Error: Could not find asset cosmos start marker");
    process.exit(1);
  }

  const beforeCast = content.substring(0, startIdx);
  const afterCast = content.substring(endIdx);

  fs.writeFileSync(appPath, beforeCast + afterCast, 'utf8');
  console.log("Old Cast Profile Manager removed from left sidebar successfully!");
} catch (err) {
  console.error("Error during cast panel removal:", err);
  process.exit(1);
}
