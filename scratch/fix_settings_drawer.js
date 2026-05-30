const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Locate settings drawer start marker
const startMarker = "{/* 右侧滑动智脑与风格配置舱 (v4.0 Premium Sliding Drawer) */}";
const startIdx = content.indexOf(startMarker);

if (startIdx !== -1) {
  // Find "showDrawer && (" immediately after
  const blockStartMarker = "showDrawer && (";
  const blockStartIdx = content.indexOf(blockStartMarker, startIdx);
  
  if (blockStartIdx !== -1) {
    const before = content.substring(0, blockStartIdx);
    // Find the next 2 lines up to the style-master-drawer div
    const styleMasterMarker = "style-master-drawer glass-card";
    const styleMasterIdx = content.indexOf(styleMasterMarker, blockStartIdx);
    
    if (styleMasterIdx !== -1) {
      // Find the closing '>' of style-master-drawer div
      const closingBracketIdx = content.indexOf(">", styleMasterIdx);
      
      if (closingBracketIdx !== -1) {
        const after = content.substring(closingBracketIdx + 1);
        
        const newStart = `<div className={\`drawer-overlay \${showDrawer ? 'open' : ''}\`} onClick={() => setShowDrawer(false)}>
          <div className={\`style-master-drawer glass-card \${showDrawer ? 'open' : ''}\`} onClick={(e) => e.stopPropagation()}>`;
          
        content = before + newStart + after;
        console.log('Successfully refactored sliding drawer opening tags!');
      } else {
        console.error('Error: Could not find closing bracket of style-master-drawer div');
        process.exit(1);
      }
    } else {
      console.error('Error: Could not find style-master-drawer class in App.jsx');
      process.exit(1);
    }
  } else {
    console.error('Error: Could not find showDrawer check in App.jsx');
    process.exit(1);
  }
} else {
  console.error('Error: Could not find settings drawer start marker in App.jsx');
  process.exit(1);
}

// 2. Locate the settings drawer closing tag right before "{/* 主工作区 */}"
const mainMarker = "{/* 主工作区 */}";
const mainIdx = content.indexOf(mainMarker);

if (mainIdx !== -1) {
  // Trace backwards from mainIdx to find ")}"
  const closingBraceIdx = content.lastIndexOf(")}", mainIdx);
  
  if (closingBraceIdx !== -1) {
    // Find the last 2 closing divs before closingBraceIdx
    // The closing structure is: </div>\n          </div>\n        </div>\n      )}
    const divEndMarker = "</div>";
    const lastDivEndIdx = content.lastIndexOf(divEndMarker, closingBraceIdx);
    const prevDivEndIdx = content.lastIndexOf(divEndMarker, lastDivEndIdx - 1);
    
    if (prevDivEndIdx !== -1) {
      const before = content.substring(0, prevDivEndIdx + divEndMarker.length);
      const after = content.substring(closingBraceIdx + 2);
      
      // Close the two divs properly
      const newEnd = `\n          </div>\n        </div>`;
      
      content = before + newEnd + after;
      console.log('Successfully refactored sliding drawer closing tags!');
    } else {
      console.error('Error: Could not find second last closing div for settings drawer');
      process.exit(1);
    }
  } else {
    console.error('Error: Could not find )} closing brace for settings drawer');
    process.exit(1);
  }
} else {
  console.error('Error: Could not find mainMarker in App.jsx');
  process.exit(1);
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx settings drawer responsiveness fix completed!');
