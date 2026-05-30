const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Locate the lightbox preview end block or consistency warning overlay and insert before the final closing </div>
const consistencyMarker = "{/* Lightbox Image Preview Modal */}";
const consistencyIdx = content.indexOf(consistencyMarker);

if (consistencyIdx !== -1) {
  const before = content.substring(0, consistencyIdx);
  const after = content.substring(consistencyIdx);
  
  const assetModalJSX = `
      {/* 资产定妆/精修空间舱 (Asset Refiner Cabin Modal) */}
      {activeAssetModal && (
        <div className="modal-overlay" onClick={() => setActiveAssetModal(null)} style={{ zIndex: 2999, background: 'rgba(3, 4, 8, 0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className={\`asset-refiner-modal \${activeAssetModal.type === 'scenery' ? 'scenery-type' : ''}\`} 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '540px', background: 'rgba(10, 12, 20, 0.92)', backdropFilter: 'blur(25px)', border: activeAssetModal.type === 'scenery' ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)', borderRadius: '16px', padding: '20px' }}
          >
            <div className="asset-refiner-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 className="asset-refiner-title" style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                {activeAssetModal.type === 'char' ? (
                  <>
                    <User style={{ width: '14px', height: '14px', color: 'var(--accent)' }} />
                    <span>角色原画定妆舱 (Character Asset Cabin)</span>
                  </>
                ) : (
                  <>
                    <Layers style={{ width: '14px', height: '14px', color: '#00f2fe' }} />
                    <span>空间场景原画舱 (Scenery Environment Cabin)</span>
                  </>
                )}
              </h3>
              <button 
                onClick={() => setActiveAssetModal(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div className="asset-refiner-body">
              {activeAssetModal.type === 'char' ? (() => {
                const char = characters.find(c => c.id === activeAssetModal.id);
                if (!char) return <p style={{ color: 'var(--text-muted)' }}>未找到该角色</p>;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>角色姓名</label>
                        <input 
                          type="text" 
                          value={char.name} 
                          onChange={(e) => handleUpdateCharacter(char.id, { name: e.target.value })} 
                          className="input-tech" 
                          style={{ height: '30px', fontSize: '11px', marginBottom: '8px' }}
                        />
                        
                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>角色定位</label>
                        <select 
                          value={char.role_type || '主角'} 
                          onChange={(e) => handleUpdateCharacter(char.id, { role_type: e.target.value })} 
                          className="input-tech"
                          style={{ height: '30px', padding: '4px', fontSize: '11px', background: '#090a0f', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '8px' }}
                        >
                          <option value="主角">🎭 主角 (Protagonist)</option>
                          <option value="配角">👥 配角 (Supporting)</option>
                          <option value="反派">💀 反派 (Antagonist)</option>
                          <option value="旁白">🎙️ 旁白 (Narrator)</option>
                        </select>

                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>外观/服饰/容貌 Prompt</label>
                        <textarea 
                          rows={4}
                          value={char.appearance_prompt || ''} 
                          onChange={(e) => handleUpdateCharacter(char.id, { appearance_prompt: e.target.value })} 
                          className="input-tech" 
                          placeholder="描述发型、衣服、长相、特征，例如：黑色短发少年，穿着青色玄羽道袍，眼神坚定..."
                          style={{ fontSize: '11px', resize: 'none', padding: '6px', minHeight: '80px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>快速渲染指令</label>
                        
                        <button 
                          onClick={() => handleGenerateAvatar(char.id, char.appearance_prompt)}
                          disabled={generatingAvatarId === char.id}
                          className="btn-cyber"
                          style={{ width: '100%', height: '28px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          {generatingAvatarId === char.id ? '正在渲染...' : '👤 一键生成头像'}
                        </button>
                        
                        <button 
                          onClick={() => handleGenerateTurnaround(char.id, char.appearance_prompt)}
                          disabled={generatingTurnaroundId === char.id}
                          className="btn-cyber"
                          style={{ width: '100%', height: '28px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          {generatingTurnaroundId === char.id ? '正在渲染...' : '📐 一键生成三视图'}
                        </button>

                        <button 
                          onClick={() => handleGeneratePose(char.id, char.appearance_prompt)}
                          disabled={generatingPoseId === char.id}
                          className="btn-cyber"
                          style={{ width: '100%', height: '28px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          {generatingPoseId === char.id ? '正在渲染...' : '🏃 一键全身姿态图'}
                        </button>

                        <button 
                          onClick={() => handleDeleteCharacter(char.id)}
                          className="btn-delete"
                          style={{ width: '100%', height: '28px', fontSize: '10px', marginTop: 'auto', background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.25)', color: '#fda4af', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          🗑️ 注销该角色
                        </button>
                      </div>
                    </div>

                    <div className="character-sheets-display" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                      <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>渲染定妆照与参考表 (点击可放大)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '8px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', padding: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>角色头像</span>
                          {char.avatar_url ? (
                            <img 
                              src={char.avatar_url} 
                              alt="头像" 
                              onClick={() => setPreviewImageUrl(char.avatar_url)}
                              style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'zoom-in' }} 
                            />
                          ) : (
                            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.05)', fontSize: '16px' }}>👤</div>
                          )}
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', padding: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>三视图 (Turnaround)</span>
                          {char.turnaround_url ? (
                            <img 
                              src={char.turnaround_url} 
                              alt="三视图" 
                              onClick={() => setPreviewImageUrl(char.turnaround_url)}
                              style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'zoom-in' }} 
                            />
                          ) : (
                            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.05)', fontSize: '16px' }}>📐</div>
                          )}
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', padding: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>姿态参考 (Pose)</span>
                          {char.pose_url ? (
                            <img 
                              src={char.pose_url} 
                              alt="姿态" 
                              onClick={() => setPreviewImageUrl(char.pose_url)}
                              style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'zoom-in' }} 
                            />
                          ) : (
                            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.05)', fontSize: '16px' }}>🏃</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })() : (() => {
                const scen = sceneryList.find(s => s.id === activeAssetModal.id);
                if (!scen) return <p style={{ color: 'var(--text-muted)' }}>未找到该场景空间</p>;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>场景空间名称</label>
                        <input 
                          type="text" 
                          value={scen.name} 
                          onChange={(e) => handleUpdateScenery(scen.id, { name: e.target.value })} 
                          className="input-tech" 
                          style={{ height: '30px', fontSize: '11px', marginBottom: '8px' }}
                        />

                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>场景空间环境 Prompt</label>
                        <textarea 
                          rows={6}
                          value={scen.environment_prompt || ''} 
                          onChange={(e) => handleUpdateScenery(scen.id, { environment_prompt: e.target.value })} 
                          className="input-tech" 
                          placeholder="描述场景的氛围、天气、灯光、摆设，例如：宏伟古老的修仙大殿，青石铺地，两旁耸立着神龙雕像石柱，远处有一座散发金光的王座，雾气缭绕，庄严肃穆..."
                          style={{ fontSize: '11px', resize: 'none', padding: '6px', minHeight: '100px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="label-tech" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>场景原画管理</label>
                        
                        <button 
                          onClick={() => handleGenerateSceneryImage(scen.id, scen.environment_prompt)}
                          disabled={generatingSceneryId === scen.id}
                          className="btn-cyber"
                          style={{ width: '100%', height: '28px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderColor: 'rgba(0,242,254,0.3)', color: '#00f2fe' }}
                        >
                          {generatingSceneryId === scen.id ? '正在绘制...' : '🏞️ 渲染场景参考图'}
                        </button>

                        <button 
                          onClick={() => handleDeleteScenery(scen.id)}
                          className="btn-delete"
                          style={{ width: '100%', height: '28px', fontSize: '10px', marginTop: 'auto', background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.25)', color: '#fda4af', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          🗑️ 注销该空间场景
                        </button>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>场景空间视觉建立参考原画 (点击可放大)</span>
                      {scen.image_url ? (
                        <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <img 
                            src={scen.image_url} 
                            alt="场景图" 
                            onClick={() => setPreviewImageUrl(scen.image_url)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} 
                          />
                        </div>
                      ) : (
                        <div style={{ height: '120px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.05)', fontSize: '18px' }}>🏞️ 暂无参考原画</div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
  `;
  
  content = before + assetModalJSX + after;
  fs.writeFileSync(appPath, content, 'utf8');
  console.log('Successfully appended Asset Refiner Modal to App.jsx!');
} else {
  console.error('Error: Could not find Lightbox Image Preview Modal comment in App.jsx');
  process.exit(1);
}
