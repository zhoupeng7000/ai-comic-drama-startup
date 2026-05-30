const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');

try {
  let content = fs.readFileSync(appPath, 'utf8');

  // 1. Strip the style-hub-panel and clean up the workspace actions on workspace-topbar
  const topbarStart = '<div className="glass-card workspace-topbar">';
  const topbarIdx = content.indexOf(topbarStart);
  if (topbarIdx === -1) {
    console.error("Error: Could not find workspace-topbar start");
    process.exit(1);
  }

  // Find the start of the scenes container list or loader
  const timelineStartMarker = '{/* 加载中状态 */}';
  const timelineStartIdx = content.indexOf(timelineStartMarker);
  if (timelineStartIdx === -1) {
    console.error("Error: Could not find timelineStartMarker");
    process.exit(1);
  }

  // We will replace everything from topbarActions start to timelineStartMarker with a cleaned topbar
  const beforeTopbar = content.substring(0, topbarIdx);
  const afterTopbar = content.substring(timelineStartIdx);

  const cleanTopbar = `
          <div className="glass-card workspace-topbar">
            <div className="workspace-title-box">
              <h2 className={\`workspace-title \${!currentStoryboard ? 'empty' : ''}\`}>
                {currentStoryboard ? (
                  <>
                    <Layers style={{ width: '16px', height: '16px', color: 'var(--primary)' }} /> 
                    <span>{currentStoryboard.title}</span>
                  </>
                ) : (
                  <>
                    <Tv style={{ width: '16px', height: '16px' }} />
                    <span>等待智能分镜生成...</span>
                  </>
                )}
              </h2>
              {currentStoryboard && (
                <p className="workspace-subtitle">
                  分镜镜头总数: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{scenes.length} FRAMES</span>
                </p>
              )}
            </div>

            {currentStoryboard && (
              <div className="workspace-actions">
                {/* 视图切换按钮 */}
                <div className="view-toggle-group">
                  <button 
                    onClick={() => setViewMode('cards')} 
                    className={\`btn-view-toggle \${viewMode === 'cards' ? 'active' : ''}\`}
                  >
                    <List style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={\`btn-view-toggle \${viewMode === 'grid' ? 'active' : ''}\`}
                  >
                    <Grid style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
            )}
          </div>

          `;

  let step1Content = beforeTopbar + cleanTopbar + afterSidebarMarker(afterTopbar);

  fs.writeFileSync(appPath, step1Content, 'utf8');
  console.log("App.jsx timeline topbar and global style engine cleaned up programmatically!");

} catch (err) {
  console.error("Error during refactoring step 1:", err);
  process.exit(1);
}

function afterSidebarMarker(txt) {
  return txt;
}
