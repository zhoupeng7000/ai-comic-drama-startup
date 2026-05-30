const fs = require('fs');
const path = require('path');

const appPath = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Inject state declarations
const statesMarker = "const [consistencyWarningSceneId, setConsistencyWarningSceneId] = useState(null);";
const statesIdx = content.indexOf(statesMarker);

if (statesIdx !== -1) {
  const insertPos = statesIdx + statesMarker.length;
  const before = content.substring(0, insertPos);
  const after = content.substring(insertPos);
  
  const newStates = `

  // v4.0 Workspace Fusion & Drill-down states
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeAssetModal, setActiveAssetModal] = useState(null);
  const [sceneryList, setSceneryList] = useState([]);
  const [generatingSceneryId, setGeneratingSceneryId] = useState(null);
  const [bgmPreset, setBgmPreset] = useState(() => localStorage.getItem('bgm_preset') || 'none');
  const [bgmCustomUrl, setBgmCustomUrl] = useState(() => localStorage.getItem('bgm_custom_url') || '');
  const [synthesizingAll, setSynthesizingAll] = useState(false);
  const [synthesizeProgress, setSynthesizeProgress] = useState(0);
  const [exportingJianying, setExportingJianying] = useState(false);`;
  
  content = before + newStates + after;
  console.log('Successfully injected state variables!');
} else {
  console.error('Error: Could not find statesMarker in App.jsx');
  process.exit(1);
}

// 2. Replace currentStoryboard useEffect hook
const hookStartMarker = "useEffect(() => {\r\n    if (currentStoryboard) {\r\n      fetchCharacters(currentStoryboard.id);";
let hookStartIdx = content.indexOf(hookStartMarker);

if (hookStartIdx === -1) {
  // Try with Unix line endings
  const hookStartMarkerUnix = "useEffect(() => {\n    if (currentStoryboard) {\n      fetchCharacters(currentStoryboard.id);";
  hookStartIdx = content.indexOf(hookStartMarkerUnix);
}

if (hookStartIdx !== -1) {
  const hookEndMarker = "}, [currentStoryboard]);";
  const hookEndIdx = content.indexOf(hookEndMarker, hookStartIdx);
  
  if (hookEndIdx !== -1) {
    const replaceEndIdx = hookEndIdx + hookEndMarker.length;
    const before = content.substring(0, hookStartIdx);
    const after = content.substring(replaceEndIdx);
    
    const newHook = `useEffect(() => {
    if (currentStoryboard) {
      fetchCharacters(currentStoryboard.id);
      fetchScenery(currentStoryboard.id);
      if (currentStoryboard.master_seed !== undefined && currentStoryboard.master_seed !== null) {
        setMasterSeed(currentStoryboard.master_seed);
      }
      if (currentStoryboard.style_preset) {
        setStylePreset(currentStoryboard.style_preset);
      }
      if (currentStoryboard.style_ref_url) {
        setStyleRefUrl(currentStoryboard.style_ref_url);
      }
      setBgmPreset(currentStoryboard.bgm_preset || 'none');
      setBgmCustomUrl(currentStoryboard.bgm_custom_url || '');
    } else {
      setCharacters([]);
      setSceneryList([]);
      setBgmPreset('none');
      setBgmCustomUrl('');
    }
  }, [currentStoryboard]);`;
    
    content = before + newHook + after;
    console.log('Successfully replaced currentStoryboard useEffect hook!');
  } else {
    console.error('Error: Could not find currentStoryboard useEffect closing bracket');
    process.exit(1);
  }
} else {
  console.error('Error: Could not find currentStoryboard useEffect start marker');
  process.exit(1);
}

// 3. Inject new API methods before fetchHistory
const historyMarker = "const fetchHistory = async () => {";
const historyIdx = content.indexOf(historyMarker);

if (historyIdx !== -1) {
  const before = content.substring(0, historyIdx);
  const after = content.substring(historyIdx);
  
  const newMethods = `// ----------------------------------------------------
  // v4.0 Scenery, BGM, TTS, and CapCut API Methods
  // ----------------------------------------------------

  const fetchScenery = async (storyboardId) => {
    try {
      const res = await fetch(\`/api/scenery/\${storyboardId}\`);
      if (res.ok) {
        const data = await res.json();
        setSceneryList(data);
      }
    } catch (err) {
      console.error('Failed to fetch scenery list:', err);
    }
  };

  const handleAddScenery = async () => {
    if (!currentStoryboard) return;
    try {
      const res = await fetch('/api/scenery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyboard_id: currentStoryboard.id,
          name: '新场景空间',
          prompt: ''
        })
      });
      if (res.ok) {
        fetchScenery(currentStoryboard.id);
      }
    } catch (err) {
      console.error('Failed to add scenery:', err);
    }
  };

  const handleUpdateScenery = async (sceneryId, updatedFields) => {
    try {
      const res = await fetch(\`/api/scenery/\${sceneryId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        if (currentStoryboard) fetchScenery(currentStoryboard.id);
      }
    } catch (err) {
      console.error('Failed to update scenery:', err);
    }
  };

  const handleDeleteScenery = async (sceneryId) => {
    if (!confirm('确定要删除该场景空间吗？')) return;
    try {
      const res = await fetch(\`/api/scenery/\${sceneryId}\`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setActiveAssetModal(null);
        if (currentStoryboard) fetchScenery(currentStoryboard.id);
      }
    } catch (err) {
      console.error('Failed to delete scenery:', err);
    }
  };

  const handleGenerateSceneryImage = async (sceneryId, prompt) => {
    setGeneratingSceneryId(sceneryId);
    try {
      const res = await fetch(\`/api/scenery/\${sceneryId}/generate-image\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, stylePreset, masterSeed, styleRefUrl })
      });
      if (res.ok) {
        if (currentStoryboard) fetchScenery(currentStoryboard.id);
      } else {
        const errData = await res.json();
        alert('场景原画生成失败: ' + (errData.error || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to generate scenery image:', err);
      alert('场景原画生成请求出错');
    } finally {
      setGeneratingSceneryId(null);
    }
  };

  const handleUploadBgm = async (e) => {
    if (!currentStoryboard) return;
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('bgm', file);
    try {
      const res = await fetch(\`/api/storyboard/\${currentStoryboard.id}/upload-bgm\`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setBgmCustomUrl(data.bgm_custom_url);
        setBgmPreset('none');
        alert('自定义背景音乐上传成功！');
      }
    } catch (err) {
      console.error('Failed to upload BGM:', err);
      alert('背景音乐上传失败');
    }
  };

  const handleSelectBgmPreset = async (val) => {
    if (!currentStoryboard) return;
    setBgmPreset(val);
    if (val !== 'none') {
      setBgmCustomUrl('');
    }
    try {
      await fetch(\`/api/storyboard/\${currentStoryboard.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bgm_preset: val,
          bgm_custom_url: val === 'none' ? '' : null
        })
      });
    } catch (err) {
      console.error('Failed to select BGM preset:', err);
    }
  };

  const handleBatchSynthesizeTTS = async () => {
    if (!currentStoryboard || scenes.length === 0) return;
    setSynthesizingAll(true);
    setSynthesizeProgress(0);
    try {
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setSynthesizeProgress(Math.round((i / scenes.length) * 100));
        
        let voiceName = scene.jianying_voice || '故事旁白';
        let dialogueText = scene.dialogue || '';
        
        if (dialogueText.trim()) {
          const res = await fetch('/api/scene/generate-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scene_id: scene.id,
              voice_name: voiceName,
              text: dialogueText,
              tts_api_key: ttsApiKey,
              tts_api_url: ttsApiUrl,
              tts_model_name: ttsModelName
            })
          });
          if (!res.ok) {
            console.error(\`Failed to synthesize scene \${scene.scene_number}\`);
          }
        }
      }
      setSynthesizeProgress(100);
      setTimeout(async () => {
        setSynthesizingAll(false);
        setSynthesizeProgress(0);
        // Silent reload
        const res = await fetch(\`/api/storyboard/\${currentStoryboard.id}\`);
        if (res.ok) {
          const data = await res.json();
          setCurrentStoryboard(data.storyboard);
          setScenes(data.scenes);
        }
        alert('所有分镜台词AI配音合成完毕！');
      }, 800);
    } catch (err) {
      console.error('Failed to batch synthesize TTS:', err);
      alert('批量语音合成请求出错');
      setSynthesizingAll(false);
    }
  };

  const handleExportJianyingDraft = async () => {
    if (!currentStoryboard) return;
    setExportingJianying(true);
    try {
      const res = await fetch(\`/api/storyboard/\${currentStoryboard.id}/export-jianying\`, {
        method: 'POST'
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`Jianying_Draft_Storyboard_\${currentStoryboard.id}.zip\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('剪映工程打包失败，请确保您已合成语音和渲染画面');
      }
    } catch (err) {
      console.error('Failed to export CapCut draft:', err);
      alert('打包导出剪映草稿请求出错');
    } finally {
      setExportingJianying(false);
    }
  };

  `;
  
  content = before + newMethods + after;
  console.log('Successfully injected API methods!');
} else {
  console.error('Error: Could not find historyMarker in App.jsx');
  process.exit(1);
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx state and API injection complete!');
