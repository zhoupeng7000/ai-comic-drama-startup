const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');

try {
  let content = fs.readFileSync(appPath, 'utf8');

  // Find the start index of the status-card comment
  const targetComment = '{/* 智脑运行状态卡片 */}';
  const startIdx = content.indexOf(targetComment);
  if (startIdx === -1) {
    console.error("Error: Could not find '{/* 智脑运行状态卡片 */}' in App.jsx");
    process.exit(1);
  }

  // Find the end index which is the closing tag right before </aside>
  const asideEndTag = '</aside>';
  const endIdx = content.indexOf(asideEndTag, startIdx);
  if (endIdx === -1) {
    console.error("Error: Could not find </aside> after status card");
    process.exit(1);
  }

  const beforeSidebar = content.substring(0, startIdx);
  const afterSidebar = content.substring(endIdx);

  const sidebarContent = `
                  {/* 素材指引 (Asset Cosmos Panel) */}
                  <div className="asset-cosmos-panel" style={{ marginTop: '10px' }}>
                    <div className="sidebar-section-title">
                      <User style={{ width: '13px', height: '13px', color: 'var(--accent)' }} />
                      <span>素材资产宇宙 (Assets Cosmos)</span>
                    </div>
                    
                    <div className="asset-cosmos-header">
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🎭 演员角色 (\${characters.length})</span>
                      <button type="button" className="btn-cosmos-add" onClick={handleAddCharacter}>+ 角色</button>
                    </div>
                    <div className="cosmos-list">
                      {characters.map(char => (
                        <div key={char.id} className="cosmos-item" onClick={() => setActiveAssetModal({ type: 'char', id: char.id })}>
                          <span className="cosmos-item-name">
                            {char.avatar_url ? (
                              <img src={char.avatar_url} alt="" style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : '👤'}
                            <span>{char.name}</span>
                          </span>
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{char.role_type} ›</span>
                        </div>
                      ))}
                    </div>

                    <div className="asset-cosmos-header" style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🏞️ 空间场景 (\${sceneryList.length})</span>
                      <button type="button" className="btn-cosmos-add" onClick={handleAddScenery}>+ 场景</button>
                    </div>
                    <div className="cosmos-list">
                      {sceneryList.map(scen => (
                        <div key={scen.id} className="cosmos-item" onClick={() => setActiveAssetModal({ type: 'scenery', id: scen.id })}>
                          <span className="cosmos-item-name">
                            {scen.image_url ? (
                              <img src={scen.image_url} alt="" style={{ width: '14px', height: '14px', borderRadius: '4px', objectFit: 'cover' }} />
                            ) : '🏞️'}
                            <span>{scen.name}</span>
                          </span>
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>详情 ›</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 后期音轨与专业打包舱 */}
                  <div className="sidebar-audio-suite">
                    <div className="sidebar-section-title">
                      <Music style={{ width: '13px', height: '13px', color: 'var(--primary)' }} />
                      <span>全局背景音乐配置 (BGM)</span>
                    </div>
                    <select
                      className="input-tech select-tech-bgm"
                      value={bgmPreset || 'none'}
                      onChange={(e) => handleSelectBgmPreset(e.target.value)}
                      style={{ height: '30px', fontSize: '11px', padding: '4px', background: '#090a0f', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <option value="none">🎵 无背景音乐 (仅配音对白)</option>
                      <option value="epic_martial">🥋 热血修仙 · 仙侠战歌</option>
                      <option value="mystic_forest">🌳 幻境之森 · 玄幻轻柔</option>
                      <option value="dark_dungeon">💀 深渊冥火 · 霸气暗黑</option>
                      <option value="cyber_punk">⚡ 赛博修仙 · 重低音摇滚</option>
                    </select>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <label htmlFor="sidebar-bgm-upload" className="btn-cosmos-add" style={{ textAlign: 'center', flex: 1, padding: '4px 0', cursor: 'pointer' }}>
                        <Upload style={{ width: '10px', height: '10px', marginRight: '4px' }} />
                        <span>自定义 BGM</span>
                      </label>
                      <input
                        id="sidebar-bgm-upload"
                        type="file"
                        accept="audio/mp3"
                        style={{ display: 'none' }}
                        onChange={handleUploadBgm}
                      />
                      {bgmCustomUrl && <span style={{ fontSize: '10px', color: '#8dffa5' }}>已加载 🔊</span>}
                    </div>

                    <div className="sidebar-section-title" style={{ marginTop: '4px' }}>
                      <Volume2 style={{ width: '13px', height: '13px', color: 'var(--accent)' }} />
                      <span>AI 角色台词一键配音 (TTS)</span>
                    </div>

                    {synthesizingAll ? (
                      <div className="synth-all-progress-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                          <span>正在配音...</span>
                          <span style={{ fontWeight: 'bold' }}>\${synthesizeProgress}%</span>
                        </div>
                        <div className="synth-progress-track-large" style={{ height: '6px' }}>
                          <div className="synth-progress-bar-large" style={{ width: \`\${synthesizeProgress}%\` }}></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-cyber"
                        onClick={handleBatchSynthesizeTTS}
                        style={{ width: '100%', height: '32px', fontSize: '11px' }}
                      >
                        <Volume2 style={{ width: '12px', height: '12px' }} />
                        <span>一键批量合成所有台词</span>
                      </button>
                    )}

                    <div className="sidebar-section-title" style={{ marginTop: '4px' }}>
                      <Tv style={{ width: '13px', height: '13px', color: '#ffb938' }} />
                      <span>剪映专业版打包导出</span>
                    </div>

                    <button
                      type="button"
                      className="btn-export-jianying-majestic"
                      onClick={handleExportJianyingDraft}
                      disabled={exportingJianying}
                      style={{ width: '100%', height: '42px', fontSize: '12px', borderRadius: '6px' }}
                    >
                      {exportingJianying ? (
                        <>
                          <RefreshCw className="animate-spin" style={{ width: '14px', height: '14px' }} />
                          <span>正在打包...</span>
                        </>
                      ) : (
                        <>
                          <Zap style={{ width: '14px', height: '14px', color: '#ffb938' }} />
                          <span>打包导出剪映草稿工程</span>
                        </>
                      )}
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button type="button" onClick={handleExportSRT} className="btn-cosmos-add" style={{ padding: '3px 0' }}>字幕轨 (.srt)</button>
                      <button type="button" onClick={handleDownloadJSON} className="btn-cosmos-add" style={{ padding: '3px 0' }}>备份工程 (.json)</button>
                    </div>
                  </div>
                  \n`;

  const newContent = beforeSidebar + sidebarContent + afterSidebar;

  fs.writeFileSync(appPath, newContent, 'utf8');
  console.log("App.jsx Left Sidebar refactored successfully!");
} catch (err) {
  console.error("Error during sidebar refactoring:", err);
  process.exit(1);
}
