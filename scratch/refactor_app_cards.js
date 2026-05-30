const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Replace scene-meta-badges block in App.jsx
const badgesStartMarker = '<div className="scene-meta-badges"';
const badgesStartIdx = content.indexOf(badgesStartMarker);

const badgesEndMarker = '<div className="scene-card-right">';
const badgesEndIdx = content.indexOf(badgesEndMarker, badgesStartIdx);

if (badgesStartIdx !== -1 && badgesEndIdx !== -1) {
  const before = content.substring(0, badgesStartIdx);
  const after = content.substring(badgesEndIdx);
  
  const miniBadges = `<div className="scene-meta-badges" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {/* 角色定妆微型徽章 */}
                          {scene.character_ids ? (
                            scene.character_ids.split(',').map(cid => {
                              const char = characters.find(c => c.id === parseInt(cid, 10));
                              if (!char) return null;
                              return (
                                <div 
                                  key={char.id} 
                                  onClick={() => setActiveAssetModal({ type: 'char', id: char.id })}
                                  className="mini-badge-interactive"
                                  title={\`点击打开【\${char.name}】定妆舱三视图与全身姿态管理\`}
                                >
                                  {char.avatar_url ? (
                                    <img src={char.avatar_url} alt="" style={{ width: '12px', height: '12px', borderRadius: '50%', objectFit: 'cover' }} />
                                  ) : '👤'}
                                  <span>{char.name}</span>
                                </div>
                              );
                            })
                          ) : (
                            <div 
                              onClick={() => handleEditClick(scene)}
                              className="mini-badge-interactive unlinked"
                              title="暂无角色，点击在导剪工坊绑定"
                            >
                              👤 未绑定演员
                            </div>
                          )}

                          {/* 空间场景原画徽章 */}
                          {(() => {
                            const scenery = sceneryList.find(s => s.id === scene.scenery_id);
                            if (scenery) {
                              return (
                                <div 
                                  onClick={() => setActiveAssetModal({ type: 'scenery', id: scenery.id })}
                                  className="mini-badge-interactive scenery"
                                  title={\`点击打开【\${scenery.name}】空间场景原画舱管理\`}
                                >
                                  {scenery.image_url ? (
                                    <img src={scenery.image_url} alt="" style={{ width: '12px', height: '12px', borderRadius: '2px', objectFit: 'cover' }} />
                                  ) : '🏞️'}
                                  <span>{scenery.name}</span>
                                </div>
                              );
                            } else {
                              return (
                                <div 
                                  onClick={() => handleEditClick(scene)}
                                  className="mini-badge-interactive unlinked"
                                  title="未绑定空间舱，点击在导剪工坊中关联"
                                >
                                  🏞️ 未关联空间舱
                                </div>
                              );
                            }
                          })()}

                          {/* 音色试听 */}
                          <span 
                            onClick={() => playVoicePreview(scene.jianying_voice || '故事旁白')}
                            className="mini-badge-interactive"
                            style={{ background: 'rgba(185, 39, 252, 0.12)', borderColor: 'rgba(185, 39, 252, 0.3)' }}
                            title="点击试听配音音色"
                          >
                            🎙️ {scene.jianying_voice || '故事旁白'} 🔊
                          </span>
                        </div>
                      </div>
                      `;
                      
  content = before + miniBadges + after;
  console.log('Successfully refactored scene meta badges into interactive mini-badges!');
} else {
  console.error('Could not find scene-meta-badges start or end!');
}

// 2. Replace Edit button with 导剪工坊 glowing neon button
const editBtnStartMarker = '<button \r\n                              onClick={() => handleEditClick(scene)}';
let editBtnStartIdx = content.indexOf(editBtnStartMarker);

if (editBtnStartIdx === -1) {
  // Try with Unix line ending just in case
  const editBtnStartMarkerUnix = '<button \n                              onClick={() => handleEditClick(scene)}';
  editBtnStartIdx = content.indexOf(editBtnStartMarkerUnix);
}

if (editBtnStartIdx !== -1) {
  const buttonCloseIdx = content.indexOf('</button>', editBtnStartIdx);
  if (buttonCloseIdx !== -1) {
    const replaceEndIdx = buttonCloseIdx + '</button>'.length;
    
    const before = content.substring(0, editBtnStartIdx);
    const after = content.substring(replaceEndIdx);
    
    const v4EditBtn = `<button 
                              onClick={() => handleEditClick(scene)}
                              className="btn-director-workshop-accent"
                              title="微调运镜台词、绑定人物原景"
                            >
                              <Edit style={{ width: '13px', height: '13px' }} />
                              <span>导剪工坊</span>
                            </button>`;
                            
    content = before + v4EditBtn + after;
    console.log('Successfully replaced edit button with glowing 导剪工坊 button!');
  } else {
    console.error('Could not find </button> after editBtnStartIdx');
  }
} else {
  // Let's try locating via className="btn-action-small" inside scene-card-right
  const btnActionSmallMarker = 'className="btn-action-small"';
  const smallBtnIdx = content.indexOf(btnActionSmallMarker);
  
  if (smallBtnIdx !== -1) {
    const openBtnIdx = content.lastIndexOf('<button', smallBtnIdx);
    const closeBtnIdx = content.indexOf('</button>', smallBtnIdx) + '</button>'.length;
    
    if (openBtnIdx !== -1 && closeBtnIdx !== -1) {
      const before = content.substring(0, openBtnIdx);
      const after = content.substring(closeBtnIdx);
      
      const v4EditBtn = `<button 
                              onClick={() => handleEditClick(scene)}
                              className="btn-director-workshop-accent"
                              title="微调运镜台词、绑定人物原景"
                            >
                              <Edit style={{ width: '13px', height: '13px' }} />
                              <span>导剪工坊</span>
                            </button>`;
                            
      content = before + v4EditBtn + after;
      console.log('Successfully replaced edit button via class name fallback!');
    }
  } else {
    console.error('Could not find edit button start marker!');
  }
}

// 3. Replace prompt-console with premium quick copy Prompt bar
const promptConsoleMarker = '<div className="prompt-console">';
const promptConsoleIdx = content.indexOf(promptConsoleMarker);

if (promptConsoleIdx !== -1) {
  const audioCommentMarker = '{/* 声音和对白 */}';
  const audioCommentIdx = content.indexOf(audioCommentMarker, promptConsoleIdx);
  
  if (audioCommentIdx !== -1) {
    // Find the closing </div> of prompt-console right before audioCommentIdx
    const closingDivIdx = content.lastIndexOf('</div>', audioCommentIdx);
    
    if (closingDivIdx !== -1) {
      const replaceEndIdx = closingDivIdx + '</div>'.length;
      
      const before = content.substring(0, promptConsoleIdx);
      const after = content.substring(replaceEndIdx);
      
      const quickCopyBlock = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', marginTop: '6px', marginBottom: '14px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>即梦AI中文画面提示词</span>
                          <button 
                            type="button"
                            onClick={() => handleCopyPrompt(scene.jimeng_prompt, scene.id || scene.scene_number)}
                            className={\`btn-cyber-tag \${copiedSceneId === (scene.id || scene.scene_number) ? 'active' : ''}\`}
                            style={{ padding: '2px 8px', fontSize: '10px', height: '22px' }}
                          >
                            {copiedSceneId === (scene.id || scene.scene_number) ? '已复制 ✓' : '一键复制提示词 📋'}
                          </button>
                        </div>`;
                        
      content = before + quickCopyBlock + after;
      console.log('Successfully replaced prompt-console with premium quick-copy Prompt bar!');
    } else {
      console.error('Could not find closing </div> of prompt console');
    }
  } else {
    console.error('Could not find audio comment after prompt console');
  }
} else {
  console.error('Could not find prompt-console marker');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Timeline cards refactoring script execution completed!');
