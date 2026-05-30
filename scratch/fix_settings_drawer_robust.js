const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Normalize CRLF to LF for reliable string searching
const normalizedContent = content.replace(/\r\n/g, '\n');

const targetStart = `{/* 右侧滑动智脑与风格配置舱 (v4.0 Premium Sliding Drawer) */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="style-master-drawer glass-card" onClick={(e) => e.stopPropagation()}>`;

const startIdx = normalizedContent.indexOf(targetStart);

if (startIdx !== -1) {
  const replacementStart = `{/* 右侧滑动智脑与风格配置舱 (v4.0 Premium Sliding Drawer) */}
      <div className={\`drawer-overlay \${showDrawer ? 'open' : ''}\`} onClick={() => setShowDrawer(false)}>
        <div className={\`style-master-drawer glass-card \${showDrawer ? 'open' : ''}\`} onClick={(e) => e.stopPropagation()}>`;

  const targetEnd = `            </div>
          </div>
        </div>
      )}`;

  const endIdx = normalizedContent.indexOf(targetEnd, startIdx);
  if (endIdx !== -1) {
    const before = normalizedContent.substring(0, startIdx);
    const middle = normalizedContent.substring(startIdx + targetStart.length, endIdx);
    const after = normalizedContent.substring(endIdx + targetEnd.length);

    const replacementEnd = `            </div>
          </div>
        </div>`;

    const finalContent = before + replacementStart + middle + replacementEnd + after;
    
    fs.writeFileSync(appPath, finalContent, 'utf8');
    console.log('Successfully completed robust settings drawer responsiveness fix!');
  } else {
    console.error('Error: Could not find targetEnd in App.jsx');
    process.exit(1);
  }
} else {
  console.error('Error: Could not find targetStart in App.jsx');
  process.exit(1);
}
