const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const startMarker = '<div className="header-actions">';
const startIdx = content.indexOf(startMarker);

const endMarker = '{/* 主工作区 */}';
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const searchSlice = content.substring(startIdx, endIdx);
  const lastBraceIdx = searchSlice.lastIndexOf(')}');
  
  if (lastBraceIdx !== -1) {
    const replaceEndIdx = startIdx + lastBraceIdx + 2;
    
    const before = content.substring(0, startIdx);
    const after = content.substring(replaceEndIdx);
    
    const replacement = `<div className="header-actions">
          <button 
            onClick={() => setShowDrawer(!showDrawer)} 
            className={\`btn-cyber-secondary \${showDrawer ? 'active' : ''}\`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings style={{ width: '15px', height: '15px' }} />
            <span>高级智脑与风格配置舱</span>
          </button>
        </div>
      </header>

      {/* 右侧滑动智脑与风格配置舱 (v4.0 Premium Sliding Drawer) */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="style-master-drawer glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                <Cpu style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                <span>高级智脑与风格配置舱</span>
              </h3>
              <button onClick={() => setShowDrawer(false)} className="btn-drawer-close" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '4px' }}>
              
              {/* 全局风格与种子引擎 */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.15)' }}>
                <h4 className="settings-card-title" style={{ color: 'var(--primary)' }}>
                  <Palette style={{ width: '13px', height: '13px' }} />
                  <span>全局画风与导演种子控制</span>
                </h4>
                
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="label-tech">全局风格预设 (Style Presets)</label>
                  <div className="style-preset-grid" style={{ marginTop: '8px' }}>
                    {STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        className={\`style-preset-chip \${stylePreset === preset.value ? 'active' : ''}\`}
                        onClick={() => { setStylePreset(preset.value); handleSaveStyleSettings(); }}
                        title={preset.desc}
                        type="button"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-row-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="label-tech">种子锁定 (Seed)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="number"
                        className="seed-input"
                        style={{ width: '100%', height: '32px' }}
                        value={masterSeed}
                        onChange={(e) => setMasterSeed(parseInt(e.target.value) || -1)}
                        disabled={seedLocked}
                      />
                      <button
                        type="button"
                        className={\`btn-seed-lock \${seedLocked ? 'locked' : ''}\`}
                        onClick={() => { setSeedLocked(!seedLocked); handleSaveStyleSettings(); }}
                        title={seedLocked ? '解锁种子' : '锁定种子'}
                        style={{ height: '32px', width: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {seedLocked ? <Lock style={{ width: '12px', height: '12px' }} /> : <Unlock style={{ width: '12px', height: '12px' }} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label-tech">风格参考图 URL (SREF)</label>
                    <input
                      type="text"
                      className="seed-input"
                      style={{ width: '100%', height: '32px', marginTop: '6px' }}
                      value={styleRefUrl}
                      onChange={(e) => setStyleRefUrl(e.target.value)}
                      onBlur={handleSaveStyleSettings}
                      placeholder="SREF 垫图 URL..."
                    />
                  </div>
                </div>
              </div>

              {/* 1. 剧本分镜解析 LLM */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.15)' }}>
                <h4 className="settings-card-title" style={{ color: 'var(--primary)' }}>
                  <Cpu style={{ width: '13px', height: '13px' }} />
                  <span>1. 剧本解析大模型 (LLM)</span>
                </h4>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">DeepSeek API KEY</label>
                  <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">API 请求网关 (BASE URL)</label>
                  <input type="text" value={apiUrl} onChange={e => setUrl(e.target.value)} placeholder="https://api.deepseek.com/v1/chat/completions" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">模型型号 (MODEL NAME)</label>
                  <input type="text" value={modelName} onChange={e => setModelName(e.target.value)} placeholder="deepseek-chat" className="input-tech" style={{ height: '32px' }} />
                </div>
                <button onClick={handleTestConnection} disabled={connectionStatus === 'testing'} className="btn-cyber" style={{ width: '100%', height: '28px', fontSize: '11px', marginTop: '4px' }}>
                  {connectionStatus === 'testing' ? '正在测试...' : '测试 LLM 连通性'}
                </button>
                {connectionStatus === 'success' && <div style={{ color: '#8dffa5', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✓ 连接成功 ({connectionLatency}ms)</div>}
                {connectionStatus === 'error' && <div style={{ color: '#fda4af', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✗ 失败: {connectionError}</div>}
              </div>

              {/* 2. 一键生图 T2I */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.15)' }}>
                <h4 className="settings-card-title" style={{ color: 'var(--secondary)' }}>
                  <Image style={{ width: '13px', height: '13px' }} />
                  <span>2. 画面渲染大模型 (T2I)</span>
                </h4>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生图 API KEY</label>
                  <input type="password" value={imageApiKey} onChange={e => setImageApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生图 API 网关</label>
                  <input type="text" value={imageApiUrl} onChange={e => setImageApiUrl(e.target.value)} placeholder="https://api.siliconflow.cn/v1/images/generations" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生图模型型号</label>
                  <input type="text" value={imageModelName} onChange={e => setImageModelName(e.target.value)} placeholder="black-forest-labs/FLUX.1-schnell" className="input-tech" style={{ height: '32px' }} />
                </div>
                <button onClick={handleTestImageConnection} disabled={imageConnectionStatus === 'testing'} className="btn-cyber" style={{ width: '100%', height: '28px', fontSize: '11px', marginTop: '4px' }}>
                  {imageConnectionStatus === 'testing' ? '正在测试...' : '测试生图 连通性'}
                </button>
                {imageConnectionStatus === 'success' && <div style={{ color: '#8dffa5', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✓ 连接成功 ({imageConnectionLatency}ms)</div>}
                {imageConnectionStatus === 'error' && <div style={{ color: '#fda4af', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✗ 失败: {imageConnectionError}</div>}
              </div>

              {/* 3. 一键生视频 T2V */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.15)' }}>
                <h4 className="settings-card-title" style={{ color: '#ffb938' }}>
                  <Tv style={{ width: '13px', height: '13px' }} />
                  <span>3. 一键生视频大模型 (T2V)</span>
                </h4>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生视频 API KEY</label>
                  <input type="password" value={videoApiKey} onChange={e => setVideoApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生视频 API 网关</label>
                  <input type="text" value={videoApiUrl} onChange={e => setVideoApiUrl(e.target.value)} placeholder="https://api.siliconflow.cn/v1/video/generations" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">生视频模型型号</label>
                  <input type="text" value={videoModelName} onChange={e => setVideoModelName(e.target.value)} placeholder="luma/aperture-1.0" className="input-tech" style={{ height: '32px' }} />
                </div>
                <button onClick={handleTestVideoConnection} disabled={videoConnectionStatus === 'testing'} className="btn-cyber" style={{ width: '100%', height: '28px', fontSize: '11px', marginTop: '4px' }}>
                  {videoConnectionStatus === 'testing' ? '正在测试...' : '测试视频 连通性'}
                </button>
                {videoConnectionStatus === 'success' && <div style={{ color: '#8dffa5', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✓ 连接成功 ({videoConnectionLatency}ms)</div>}
                {videoConnectionStatus === 'error' && <div style={{ color: '#fda4af', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✗ 失败: {videoConnectionError}</div>}
              </div>

              {/* 4. 语音合成大模型 TTS */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.15)' }}>
                <h4 className="settings-card-title" style={{ color: '#38ff70' }}>
                  <Volume2 style={{ width: '13px', height: '13px' }} />
                  <span>4. 语音合成大模型 (TTS)</span>
                </h4>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">语音 API KEY</label>
                  <input type="password" value={ttsApiKey} onChange={e => setTtsApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">语音 API 网关</label>
                  <input type="text" value={ttsApiUrl} onChange={e => setTtsApiUrl(e.target.value)} placeholder="https://api.siliconflow.cn/v1/audio/speech" className="input-tech" style={{ height: '32px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="label-tech">语音模型型号</label>
                  <input type="text" value={ttsModelName} onChange={e => setTtsModelName(e.target.value)} placeholder="FunAudioLLM/CosyVoice2-0.5B" className="input-tech" style={{ height: '32px' }} />
                </div>
                <button onClick={handleTestTtsConnection} disabled={ttsConnectionStatus === 'testing'} className="btn-cyber" style={{ width: '100%', height: '28px', fontSize: '11px', marginTop: '4px' }}>
                  {ttsConnectionStatus === 'testing' ? '正在测试...' : '测试语音 连通性'}
                </button>
                {ttsConnectionStatus === 'success' && <div style={{ color: '#8dffa5', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✓ 连接成功 ({ttsConnectionLatency}ms)</div>}
                {ttsConnectionStatus === 'error' && <div style={{ color: '#fda4af', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>✗ 失败: {ttsConnectionError}</div>}
              </div>

            </div>
          </div>
        </div>
      )}`;
      
    fs.writeFileSync(appPath, before + replacement + after, 'utf8');
    console.log('Successfully refactored settings accordion into sliding drawer!');
  } else {
    console.error('Could not find closing ); of settings accordion');
  }
} else {
  console.error('Could not find startMarker or endMarker');
}
