const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'frontend', 'src', 'App.jsx');

try {
  let content = fs.readFileSync(appPath, 'utf8');

  // Locate loop start via the scene-card class
  const cardStartMarker = 'className="scene-card"';
  const loopIdx = content.indexOf(cardStartMarker);
  if (loopIdx === -1) {
    console.error("Error: Could not find scene-card start");
    process.exit(1);
  }

  // Locate the card badges block start
  const badgeStartMarker = 'className="scene-meta-badges"';
  const badgeIdx = content.indexOf(badgeStartMarker, loopIdx);
  if (badgeIdx === -1) {
    console.error("Error: Could not find scene-meta-badges start");
    process.exit(1);
  }

  // Find the end of the badge area (which ends at `className="scene-card-right"`)
  const rightCardMarker = 'className="scene-card-right"';
  const badgeEndIdx = content.indexOf(rightCardMarker, badgeIdx);
  if (badgeEndIdx === -1) {
    console.error("Error: Could not find scene-card-right after badges");
    process.exit(1);
  }

  // We want to slice out the entire badge container div which begins around badgeIdx
  const badgeContainerStart = content.lastIndexOf('<div', badgeIdx);
  const rightCardDivStart = content.lastIndexOf('<div', badgeEndIdx);

  const beforeBadges = content.substring(0, badgeContainerStart);
  const afterBadges = content.substring(rightCardDivStart);

  const v4Badges = `
                        <div className="scene-meta-badges" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
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

  content = beforeBadges + v4Badges + afterBadges;

  // Let's refactor the scene-card-right details: edit button and prompt console
  const editMarker = 'onClick={() => handleEditClick(scene)}';
  const editIdx = content.indexOf(editMarker);
  if (editIdx === -1) {
    console.error("Error: Could not find handleEditClick button");
    process.exit(1);
  }

  // Find surrounding button tags
  const btnStart = content.lastIndexOf('<button', editIdx);
  const btnEnd = content.indexOf('</button>', editIdx) + '</button>'.length;

  const v4EditBtn = `
                            <button 
                              onClick={() => handleEditClick(scene)}
                              className="btn-director-workshop-accent"
                              title="微调运镜台词、绑定人物原景"
                            >
                              <Edit style={{ width: '13px', height: '13px' }} />
                              <span>导剪工坊</span>
                            </button>
                            `;

  content = content.substring(0, btnStart) + v4EditBtn + content.substring(btnEnd);

  // Replace the prompt-console
  const promptConsoleMarker = 'className="prompt-console"';
  const consoleIdx = content.indexOf(promptConsoleMarker);
  if (consoleIdx === -1) {
    console.error("Error: Could not find prompt-console start");
    process.exit(1);
  }

  const consoleContainerStart = content.lastIndexOf('<div', consoleIdx);

  // Find where prompt console ends (ends right before comment "{/* 声音和对白 */}")
  const audioCommentMarker = '{/* 声音和对白 */}';
  const commentIdx = content.indexOf(audioCommentMarker, consoleIdx);
  if (commentIdx === -1) {
    console.error("Error: Could not find audio comment after prompt console");
    process.exit(1);
  }

  const consoleContainerEnd = content.lastIndexOf('</div>', commentIdx) + '</div>'.length;

  const v4PromptCopyBlock = `
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', marginTop: '6px', marginBottom: '14px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>即梦AI中文画面提示词</span>
                          <button 
                            type="button"
                            onClick={() => handleCopyPrompt(scene.jimeng_prompt, scene.id || scene.scene_number)}
                            className={\`btn-cyber-tag \${copiedSceneId === (scene.id || scene.scene_number) ? 'active' : ''}\`}
                            style={{ padding: '2px 8px', fontSize: '10px', height: '22px' }}
                          >
                            {copiedSceneId === (scene.id || scene.scene_number) ? '已复制 ✓' : '一键复制提示词 📋'}
                          </button>
                        </div>
                        `;

  content = content.substring(0, consoleContainerStart) + v4PromptCopyBlock + content.substring(consoleContainerEnd);

  fs.writeFileSync(appPath, content, 'utf8');
  console.log("App.jsx timeline cards successfully refactored programmatically!");

} catch (err) {
  console.error("Error during refactoring step 2:", err);
  process.exit(1);
}
