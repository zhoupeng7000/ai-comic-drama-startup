import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  BookOpen, 
  Settings, 
  Key, 
  Cpu, 
  Layers, 
  Copy, 
  Edit, 
  Trash2, 
  Download, 
  Sparkles, 
  Music, 
  Volume2, 
  Tv, 
  Check, 
  History,
  Grid,
  List,
  X,
  Database,
  Play,
  Image,
  RefreshCw,
  Lock,
  Unlock,
  Upload,
  User,
  Palette,
  Film,
  AlertTriangle,
  Shield,
  Activity
} from 'lucide-react';
const VOICES_CONFIG = [
  { name: '故事旁白', emoji: '🎙️', desc: '低沉磁性 · 沉稳叙事' },
  { name: '霸气总裁', emoji: '👔', desc: '冷酷霸道 · 质感低音' },
  { name: '阳光大男孩', emoji: '👦', desc: '阳光活力 · 热情高昂' },
  { name: '知性姐姐', emoji: '👩', desc: '温柔和煦 · 亲切知性' },
  { name: '魅惑御姐', emoji: '💋', desc: '妖魅沙哑 · 妩媚动人' },
  { name: '东北老铁', emoji: '🍺', desc: '幽默风趣 · 豪爽接地气' },
  { name: '系统萌娃', emoji: '👶', desc: '极高萌音 · 机械儿童音' }
];

const CAMERA_MOTION_PRESETS = [
  { value: 'static', label: '静态微动', icon: '📷', desc: '画面元素微妙动态' },
  { value: 'pan_left', label: '向左平移', icon: '⬅️', desc: '平缓向左平移推进' },
  { value: 'pan_right', label: '向右平移', icon: '➡️', desc: '平缓向右平移推进' },
  { value: 'zoom_in', label: '推进特写', icon: '🔍', desc: '缓慢推进特写' },
  { value: 'zoom_out', label: '拉远全景', icon: '🔭', desc: '缓慢拉远全景' },
  { value: 'tilt_up', label: '仰拍升', icon: '⬆️', desc: '从下往上缓慢抬升' },
  { value: 'tilt_down', label: '俯冲下', icon: '⬇️', desc: '从上往上缓慢俯冲' },
  { value: 'orbit', label: '环绕旋转', icon: '🔄', desc: '环绕人物360度旋转' },
  { value: 'dolly_in', label: '冲击推进', icon: '💨', desc: '快速推进冲击感' },
  { value: 'crane_up', label: '升降机', icon: '🏗️', desc: '升降机从低到高' },
];

const STYLE_PRESETS = [
  { value: '国风动漫', label: '🎨 国风动漫', desc: '唯美写实东方动漫插画' },
  { value: '赛博修仙', label: '⚡ 赛博修仙', desc: '赛博朋克+修仙厚涂风' },
  { value: '新海诚', label: '🌅 新海诚', desc: '唯美光影日系动画' },
  { value: '3D写实', label: '🎬 3D写实', desc: '3D渲染写实电影级画面' },
  { value: '水墨玄幻', label: '🖌️ 水墨玄幻', desc: '中国传统水墨画风格' },
  { value: '赛璐璐', label: '✨ 赛璐璐', desc: '经典日系赛璐璐动画' },
];

export default function App() {
  // 核心状态管理
  const [novelText, setNovelText] = useState(
    `天空正下着倾盆大雨，雷鸣声在苍穹间回荡。\n林默被叶家大少爷狠狠地踩在泥水里，右手手骨已经粉碎性骨折。\n“林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？”叶大少冷笑道，身边站着他高傲的未婚妻。\n林默咬紧牙齿，泥水混着血水流进嘴里。他忽然笑了，因为就在这一瞬间，脑海深处传来了一声清脆的电子提示音：\n【叮！太古神龙系统绑定成功，检测到宿主正在受到致命威胁，自动启动神龙逆天血脉！】`
  );
  
  // LLM API 设置状态 (支持本地存储)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('llm_api_key') || '');
  const [apiUrl, setUrl] = useState(() => localStorage.getItem('llm_api_url') || 'https://api.deepseek.com/v1/chat/completions');
  const [modelName, setModelName] = useState(() => localStorage.getItem('llm_model_name') || 'deepseek-chat');
  const [showSettings, setShowSettings] = useState(false);
  
  // 生图大模型 API 设置状态
  const [imageApiKey, setImageApiKey] = useState(() => localStorage.getItem('t2i_api_key') || '');
  const [imageApiUrl, setImageApiUrl] = useState(() => localStorage.getItem('t2i_api_url') || 'https://api.siliconflow.cn/v1/images/generations');
  const [imageModelName, setImageModelName] = useState(() => localStorage.getItem('t2i_model_name') || 'black-forest-labs/FLUX.1-schnell');

  // 生视频大模型 API 设置状态 (New)
  const [videoApiKey, setVideoApiKey] = useState(() => localStorage.getItem('t2v_api_key') || '');
  const [videoApiUrl, setVideoApiUrl] = useState(() => localStorage.getItem('t2v_api_url') || 'https://api.siliconflow.cn/v1/video/generations');
  const [videoModelName, setVideoModelName] = useState(() => localStorage.getItem('t2v_model_name') || 'luma/aperture-1.0');

  // 语音合成大模型 API 设置状态 (New)
  const [ttsApiKey, setTtsApiKey] = useState(() => localStorage.getItem('tts_api_key') || '');
  const [ttsApiUrl, setTtsApiUrl] = useState(() => localStorage.getItem('tts_api_url') || 'https://api.siliconflow.cn/v1/audio/speech');
  const [ttsModelName, setTtsModelName] = useState(() => localStorage.getItem('tts_model_name') || 'FunAudioLLM/CosyVoice2-0.5B');
  
  // 连通性测试状态
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [connectionLatency, setConnectionLatency] = useState(0);
  const [connectionError, setConnectionError] = useState('');
  
  const [imageConnectionStatus, setImageConnectionStatus] = useState('idle');
  const [imageConnectionLatency, setImageConnectionLatency] = useState(0);
  const [imageConnectionError, setImageConnectionError] = useState('');

  const [videoConnectionStatus, setVideoConnectionStatus] = useState('idle');
  const [videoConnectionLatency, setVideoConnectionLatency] = useState(0);
  const [videoConnectionError, setVideoConnectionError] = useState('');

  const [ttsConnectionStatus, setTtsConnectionStatus] = useState('idle');
  const [ttsConnectionLatency, setTtsConnectionLatency] = useState(0);
  const [ttsConnectionError, setTtsConnectionError] = useState('');

  // 正在渲染分镜画面/视频的场景ID
  const [generatingImageSceneId, setGeneratingImageSceneId] = useState(null);
  const [generatingVideoSceneId, setGeneratingVideoSceneId] = useState(null);

  // 数据与状态
  const [historyList, setHistoryList] = useState([]);
  const [currentStoryboard, setCurrentStoryboard] = useState(null);
  const [scenes, setScenes] = useState([]);
  
  // 视图与加载控制器
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'grid'
  const [editingScene, setEditingScene] = useState(null);
  
  // 气泡提示状态 (存储已复制提示词的镜号)
  const [copiedSceneId, setCopiedSceneId] = useState(null);

  // Visual Consistency system states
  const [characters, setCharacters] = useState([]);
  const [showCastPanel, setShowCastPanel] = useState(false);
  const [generatingAvatarId, setGeneratingAvatarId] = useState(null);
  const [generatingTurnaroundId, setGeneratingTurnaroundId] = useState(null);
  const [generatingPoseId, setGeneratingPoseId] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [showConsistencyWarning, setShowConsistencyWarning] = useState(false);
  const [consistencyWarningSceneId, setConsistencyWarningSceneId] = useState(null);

  // v4.0 Workspace Fusion & Drill-down states
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeAssetModal, setActiveAssetModal] = useState(null);
  const [sceneryList, setSceneryList] = useState([]);
  const [generatingSceneryId, setGeneratingSceneryId] = useState(null);
  const [bgmPreset, setBgmPreset] = useState(() => localStorage.getItem('bgm_preset') || 'none');
  const [bgmCustomUrl, setBgmCustomUrl] = useState(() => localStorage.getItem('bgm_custom_url') || '');
  const [synthesizingAll, setSynthesizingAll] = useState(false);
  const [synthesizeProgress, setSynthesizeProgress] = useState(0);
  const [exportingJianying, setExportingJianying] = useState(false);
  
  // Global style engine states
  const [masterSeed, setMasterSeed] = useState(() => {
    const saved = localStorage.getItem('master_seed');
    return saved ? parseInt(saved) : -1;
  });
  const [seedLocked, setSeedLocked] = useState(false);
  const [stylePreset, setStylePreset] = useState(() => localStorage.getItem('style_preset') || '国风动漫');
  const [styleRefUrl, setStyleRefUrl] = useState('');

  // 初始化拉取历史记录
  useEffect(() => {
    fetchHistory();
  }, []);

  // 监听设置变化保存至本地
  useEffect(() => {
    localStorage.setItem('llm_api_key', apiKey);
    localStorage.setItem('llm_api_url', apiUrl);
    localStorage.setItem('llm_model_name', modelName);
    
    localStorage.setItem('t2i_api_key', imageApiKey);
    localStorage.setItem('t2i_api_url', imageApiUrl);
    localStorage.setItem('t2i_model_name', imageModelName);

    localStorage.setItem('t2v_api_key', videoApiKey);
    localStorage.setItem('t2v_api_url', videoApiUrl);
    localStorage.setItem('t2v_model_name', videoModelName);

    localStorage.setItem('tts_api_key', ttsApiKey);
    localStorage.setItem('tts_api_url', ttsApiUrl);
    localStorage.setItem('tts_model_name', ttsModelName);
  }, [apiKey, apiUrl, modelName, imageApiKey, imageApiUrl, imageModelName, videoApiKey, videoApiUrl, videoModelName, ttsApiKey, ttsApiUrl, ttsModelName]);

  useEffect(() => {
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
  }, [currentStoryboard]);

  useEffect(() => {
    localStorage.setItem('master_seed', String(masterSeed));
    localStorage.setItem('style_preset', stylePreset);
  }, [masterSeed, stylePreset]);

  const fetchCharacters = async (storyboardId) => {
    try {
      const res = await fetch(`/api/characters/${storyboardId}`);
      if (res.ok) {
        const data = await res.json();
        setCharacters(data);
      }
    } catch (err) {
      console.error('Failed to load character profiles:', err);
    }
  };

  const handleAddCharacter = async () => {
    if (!currentStoryboard) return;
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyboard_id: currentStoryboard.id,
          name: '新角色',
          role_type: '主角',
          appearance_prompt: ''
        })
      });
      if (res.ok) fetchCharacters(currentStoryboard.id);
    } catch (err) {
      console.error('Failed to create character:', err);
    }
  };

  const handleUpdateCharacter = async (charId, updates) => {
    try {
      await fetch(`/api/characters/${charId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (currentStoryboard) fetchCharacters(currentStoryboard.id);
    } catch (err) {
      console.error('Failed to update character:', err);
    }
  };

  const handleDeleteCharacter = async (charId) => {
    if (!confirm('确定要删除该角色档案吗？')) return;
    try {
      await fetch(`/api/characters/${charId}`, { method: 'DELETE' });
      if (currentStoryboard) fetchCharacters(currentStoryboard.id);
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  const handleGenerateAvatar = async (charId, appearancePrompt) => {
    setGeneratingAvatarId(charId);
    try {
      const res = await fetch(`/api/characters/${charId}/generate-avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance_prompt: appearancePrompt,
          image_api_key: imageApiKey,
          image_api_url: imageApiUrl,
          image_model_name: imageModelName
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && currentStoryboard) fetchCharacters(currentStoryboard.id);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error (status: ${res.status})`);
      }
    } catch (err) {
      alert(`头像生成失败: ${err.message}`);
    } finally {
      setGeneratingAvatarId(null);
    }
  };

  const handleGenerateTurnaround = async (charId, appearancePrompt) => {
    setGeneratingTurnaroundId(charId);
    try {
      const res = await fetch(`/api/characters/${charId}/generate-turnaround`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance_prompt: appearancePrompt,
          image_api_key: imageApiKey,
          image_api_url: imageApiUrl,
          image_model_name: imageModelName
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && currentStoryboard) fetchCharacters(currentStoryboard.id);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error (status: ${res.status})`);
      }
    } catch (err) {
      alert(`三视图生成失败: ${err.message}`);
    } finally {
      setGeneratingTurnaroundId(null);
    }
  };

  const handleGeneratePose = async (charId, appearancePrompt) => {
    setGeneratingPoseId(charId);
    try {
      const res = await fetch(`/api/characters/${charId}/generate-pose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance_prompt: appearancePrompt,
          image_api_key: imageApiKey,
          image_api_url: imageApiUrl,
          image_model_name: imageModelName
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && currentStoryboard) fetchCharacters(currentStoryboard.id);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error (status: ${res.status})`);
      }
    } catch (err) {
      alert(`姿态参考图生成失败: ${err.message}`);
    } finally {
      setGeneratingPoseId(null);
    }
  };

  const handleSaveStyleSettings = async () => {
    if (!currentStoryboard) return;
    try {
      await fetch(`/api/storyboard/${currentStoryboard.id}/style`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          master_seed: masterSeed,
          style_ref_url: styleRefUrl,
          style_preset: stylePreset
        })
      });
    } catch (err) {
      console.error('Failed to save style settings:', err);
    }
  };

  // ----------------------------------------------------
  // v4.0 Scenery, BGM, TTS, and CapCut API Methods
  // ----------------------------------------------------

  const fetchScenery = async (storyboardId) => {
    try {
      const res = await fetch(`/api/scenery/${storyboardId}`);
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
      const res = await fetch(`/api/scenery/${sceneryId}`, {
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
      const res = await fetch(`/api/scenery/${sceneryId}`, {
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
      const res = await fetch(`/api/scenery/${sceneryId}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment_prompt: prompt,
          image_api_key: imageApiKey,
          image_api_url: imageApiUrl,
          image_model_name: imageModelName,
          stylePreset,
          masterSeed,
          styleRefUrl
        })
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
      const res = await fetch(`/api/storyboard/${currentStoryboard.id}/upload-bgm`, {
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
      await fetch(`/api/storyboard/${currentStoryboard.id}`, {
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
            console.error(`Failed to synthesize scene ${scene.scene_number}`);
          }
        }
      }
      setSynthesizeProgress(100);
      setTimeout(async () => {
        setSynthesizingAll(false);
        setSynthesizeProgress(0);
        // Silent reload
        const res = await fetch(`/api/storyboard/${currentStoryboard.id}`);
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
      const res = await fetch(`/api/storyboard/${currentStoryboard.id}/export-jianying`, {
        method: 'POST'
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Jianying_Draft_Storyboard_${currentStoryboard.id}.zip`;
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

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/storyboard/list');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error("无法拉取历史记录:", err);
    }
  };

  // 测试 LLM API 连通性
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');
    const startTime = Date.now();

    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
      setConnectionError('请先填写 API Key');
      setConnectionStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/test/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          api_url: apiUrl,
          model_name: modelName
        })
      });

      const endTime = Date.now();
      const result = await res.json();

      if (res.ok && result.success) {
        setConnectionLatency(endTime - startTime);
        setConnectionStatus('success');
      } else {
        throw new Error(result.error || `连接失败 (状态码: ${res.status})`);
      }
    } catch (err) {
      console.error("测试 API 连通性出错:", err);
      setConnectionError(err.message || '网络连接超时');
      setConnectionStatus('error');
    }
  };

  // 测试生图 API 连通性
  const handleTestImageConnection = async () => {
    setImageConnectionStatus('testing');
    setImageConnectionError('');
    const startTime = Date.now();

    if (!imageApiKey || imageApiKey.trim() === '' || imageApiKey === 'YOUR_IMAGE_KEY_HERE') {
      setImageConnectionError('请先填写 API Key');
      setImageConnectionStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/test/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: imageApiKey,
          api_url: imageApiUrl,
          model_name: imageModelName
        })
      });

      const endTime = Date.now();
      const result = await res.json();

      if (res.ok && result.success) {
        setImageConnectionLatency(endTime - startTime);
        setImageConnectionStatus('success');
      } else {
        throw new Error(result.error || `连接失败 (状态码: ${res.status})`);
      }
    } catch (err) {
      console.error("测试生图 API 连通性出错:", err);
      setImageConnectionError(err.message || '网络连接超时');
      setImageConnectionStatus('error');
    }
  };

  // 测试生视频 API 连通性
  const handleTestVideoConnection = async () => {
    setVideoConnectionStatus('testing');
    setVideoConnectionError('');
    const startTime = Date.now();

    if (!videoApiKey || videoApiKey.trim() === '' || videoApiKey === 'YOUR_VIDEO_KEY_HERE') {
      setVideoConnectionError('请先填写 API Key');
      setVideoConnectionStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/test/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: videoApiKey,
          api_url: videoApiUrl,
          model_name: videoModelName
        })
      });

      const endTime = Date.now();
      const result = await res.json();

      if (res.ok && result.success) {
        setVideoConnectionLatency(endTime - startTime);
        setVideoConnectionStatus('success');
      } else {
        throw new Error(result.error || `连接失败 (状态码: ${res.status})`);
      }
    } catch (err) {
      console.error("测试生视频 API 连通性出错:", err);
      setVideoConnectionError(err.message || '网络连接超时');
      setVideoConnectionStatus('error');
    }
  };

  // 测试语音合成 API 连通性
  const handleTestTtsConnection = async () => {
    setTtsConnectionStatus('testing');
    setTtsConnectionError('');
    const startTime = Date.now();

    if (!ttsApiKey || ttsApiKey.trim() === '' || ttsApiKey === 'YOUR_TTS_KEY_HERE') {
      setTtsConnectionError('请先填写 API Key');
      setTtsConnectionStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/test/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: ttsApiKey,
          api_url: ttsApiUrl,
          model_name: ttsModelName
        })
      });

      const endTime = Date.now();
      const result = await res.json();

      if (res.ok && result.success) {
        setTtsConnectionLatency(endTime - startTime);
        setTtsConnectionStatus('success');
      } else {
        throw new Error(result.error || `连接失败 (状态码: ${res.status})`);
      }
    } catch (err) {
      console.error("测试语音合成 API 连通性出错:", err);
      setTtsConnectionError(err.message || '网络连接超时');
      setTtsConnectionStatus('error');
    }
  };

  // 播放音色预览 (New Feature)
  const playVoicePreview = async (voiceName) => {
    // 停止当前浏览器原生所有播放
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // 获取各音色对应的预览测试文本
    let previewText = "我是您的漫剧配音智脑，祝您创作出爆款短视频！";
    switch(voiceName) {
      case '故事旁白':
        previewText = "乾坤未定，你我皆是黑马。欢迎收看今日的高燃漫剧。";
        break;
      case '霸气总裁':
        previewText = "女人，你是在向我叶凌天发起挑战吗？退下！";
        break;
      case '阳光大男孩':
        previewText = "师兄！我们今天终于把龙魂草采回来啦！哈哈，我们出发吧！";
        break;
      case '知性姐姐':
        previewText = "修行之路上切勿急躁，若是有什么不懂的，师姐随时在这里。";
        break;
      case '魅惑御姐':
        previewText = "呵呵……小家伙，你这眼神，姐姐可真是越来越喜欢了呢。";
        break;
      case '东北老铁':
        previewText = "哎呀妈呀老铁！这系统可太得劲了，杠杠的，必须关注！";
        break;
      case '系统萌娃':
        previewText = "叮咚！检测到宿主快要死翘翘了，系统自动为您开启神龙逆天血脉哦！";
        break;
    }

    // 1. 判断是否配置了语音大模型 (在线高品质 CosyVoice/OpenAI TTS 模式)
    const isOnlineTTS = ttsApiKey && ttsApiKey.trim() !== '' && ttsApiKey !== 'YOUR_TTS_KEY_HERE';
    if (isOnlineTTS) {
      try {
        const res = await fetch('/api/scene/generate-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voice_name: voiceName,
            text: previewText,
            tts_api_key: ttsApiKey,
            tts_api_url: ttsApiUrl,
            tts_model_name: ttsModelName
          })
        });
        
        if (!res.ok) {
          throw new Error(`TTS API 接口响应失败，状态码: ${res.status}`);
        }
        
        const result = await res.json();
        if (result.success && result.audio_base64) {
          // 播放 Base64 音频
          const audio = new Audio(`data:audio/mp3;base64,${result.audio_base64}`);
          audio.play();
          return; // 播放成功，直接返回
        }
      } catch (err) {
        console.error("在线 TTS 播放失败，自动降级为浏览器原生合成:", err);
      }
    }

    // 2. 降级为本地 Web Speech API 模式 (进行了强力的参数分化，以确保即使是单一系统女声/男声也有巨大区分度)
    if (!window.speechSynthesis) {
      alert("您的浏览器不支持 Web Speech API，且未配置在线语音大模型，无法试听");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(previewText);
    utterance.lang = 'zh-CN';
    
    // 强制调配不同音调、语速以及音量特征，实现极致本地区分度
    switch(voiceName) {
      case '故事旁白':
        utterance.pitch = 0.85; // 低沉磁性
        utterance.rate = 0.85;  // 沉稳慢速
        break;
      case '霸气总裁':
        utterance.pitch = 0.55; // 极低男低音
        utterance.rate = 0.9;   // 冷酷威严
        break;
      case '阳光大男孩':
        utterance.pitch = 1.2;  // 阳光清脆
        utterance.rate = 1.15;  // 快速热情
        break;
      case '知性姐姐':
        utterance.pitch = 1.05; // 温柔自然
        utterance.rate = 0.88;  // 知性舒缓
        break;
      case '魅惑御姐':
        utterance.pitch = 0.8;  // 性感略带低沙
        utterance.rate = 0.82;  // 充满魅惑慢速
        break;
      case '东北老铁':
        utterance.pitch = 0.95; // 洪亮豪爽
        utterance.rate = 1.3;   // 幽默超快嘴速
        break;
      case '系统萌娃':
        utterance.pitch = 1.85; // 极高频小萝莉/正太音
        utterance.rate = 1.35;  // 机械跳跃感
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        break;
    }

    // 尽可能寻找系统内不同的中文发音引擎
    const voices = window.speechSynthesis.getVoices();
    const zhVoices = voices.filter(v => v.lang.includes('ZH') || v.lang.includes('zh'));
    
    if (zhVoices.length > 0) {
      // 区分男女声：知性姐姐, 魅惑御姐, 系统萌娃 用女声；其他用男声
      const isFemaleRole = ['知性姐姐', '魅惑御姐', '系统萌娃'].includes(voiceName);
      if (isFemaleRole) {
        const female = zhVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('xiaoxiao') || v.name.toLowerCase().includes('huihui') || v.name.toLowerCase().includes('yaoyao'));
        utterance.voice = female || zhVoices[0];
      } else {
        const male = zhVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('yunting') || v.name.toLowerCase().includes('kangkang') || v.name.toLowerCase().includes('yunxi'));
        utterance.voice = male || zhVoices.find(v => v !== (zhVoices.find(v2 => v2.name.toLowerCase().includes('female')))) || zhVoices[0];
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // 一键渲染分镜画面 (Upgraded with storyboard_id)
  const handleGenerateImage = async (sceneId, prompt) => {
    setGeneratingImageSceneId(sceneId);
    try {
      const res = await fetch('/api/scene/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene_id: sceneId,
          prompt: prompt,
          storyboard_id: currentStoryboard?.id,
          image_api_key: imageApiKey,
          image_api_url: imageApiUrl,
          image_model_name: imageModelName
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Image generation failed');
      }
      const data = await res.json();
      if (data.success) {
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, image_url: data.image_url } : s));
      }
    } catch (err) {
      alert(`渲染生图失败: ${err.message}`);
    } finally {
      setGeneratingImageSceneId(null);
    }
  };

  // 一键渲染分镜视频 (I2V Safety Interception)
  const handleGenerateVideo = async (sceneId, prompt, imageUrl) => {
    if (!imageUrl) {
      setConsistencyWarningSceneId(sceneId);
      setShowConsistencyWarning(true);
      return;
    }
    setGeneratingVideoSceneId(sceneId);
    try {
      const scene = scenes.find(s => s.id === sceneId);
      const res = await fetch('/api/scene/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene_id: sceneId,
          prompt: prompt,
          image_url: imageUrl,
          camera_motion: scene?.camera_motion || 'static',
          motion_intensity: scene?.motion_intensity || 'low',
          video_api_key: videoApiKey,
          video_api_url: videoApiUrl,
          video_model_name: videoModelName
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Video generation failed');
      }
      const data = await res.json();
      if (data.success) {
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, video_url: data.video_url } : s));
      }
    } catch (err) {
      alert(`视频生成失败: ${err.message}`);
    } finally {
      setGeneratingVideoSceneId(null);
    }
  };

  const handleForceGenerateVideo = (sceneId, prompt) => {
    setShowConsistencyWarning(false);
    setConsistencyWarningSceneId(null);
    setGeneratingVideoSceneId(sceneId);
    const scene = scenes.find(s => s.id === sceneId);
    fetch('/api/scene/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scene_id: sceneId,
        prompt: prompt,
        image_url: null,
        camera_motion: scene?.camera_motion || 'static',
        motion_intensity: scene?.motion_intensity || 'low',
        video_api_key: videoApiKey,
        video_api_url: videoApiUrl,
        video_model_name: videoModelName
      })
    })
    .then(async res => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error (status: ${res.status})`);
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, video_url: data.video_url } : s));
      }
    })
    .catch(err => alert(`视频生成失败: ${err.message}`))
    .finally(() => setGeneratingVideoSceneId(null));
  };

  // 一键生成分镜
  const handleGenerate = async () => {
    if (!novelText.trim()) return;
    
    setLoading(true);
    setCurrentStoryboard(null);
    setScenes([]);
    
    // 多步渲染高级 loading
    const steps = [
      '🚀 正在读取剧本并提取核心冲突...',
      '🧬 正在利用 DeepSeek 智能分析网文爽点节奏...',
      '✨ 正在为主线角色配置一致性物理外貌特征...',
      '🎨 正在撰写适用于即梦AI(Jimeng AI)的极清中文Prompt...',
      '🎙️ 正在智能配比剪映发音人角色与声效波形...',
      '💾 正在将完整分镜表持久化存入 SQLite 数据库...'
    ];
    
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setLoadingStep(steps[stepIndex]);
      }
    }, 1800);

    try {
      const res = await fetch('/api/storyboard/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          novel_text: novelText,
          api_key: apiKey,
          api_url: apiUrl,
          model_name: modelName
        })
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '大模型解析失败');
      }

      const data = await res.json();
      if (data.success) {
        setCurrentStoryboard(data.storyboard);
        setScenes(data.scenes);
        fetchHistory(); // 刷新左侧历史
      }
    } catch (err) {
      alert(`生成失败: ${err.message}`);
    } finally {
      setLoading(false);
      clearInterval(stepInterval);
    }
  };

  // 选择历史记录
  const handleSelectHistory = async (id) => {
    setLoading(true);
    setLoadingStep('🔄 正在从 SQLite 提取历史剧本与全套分镜...');
    try {
      const res = await fetch(`/api/storyboard/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentStoryboard(data.storyboard);
        setScenes(data.scenes);
      }
    } catch (err) {
      alert('加载历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除历史分镜
  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation();
    if (!confirm('确定要彻底删除该剧本分镜吗？此操作无法撤销。')) return;
    try {
      const res = await fetch(`/api/storyboard/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentStoryboard && currentStoryboard.id === id) {
          setCurrentStoryboard(null);
          setScenes([]);
        }
        fetchHistory();
      }
    } catch (err) {
      alert('删除失败');
    }
  };

  // 一键复制即梦 Prompt
  const handleCopyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        setCopiedSceneId(id);
        setTimeout(() => setCopiedSceneId(null), 2000);
      })
      .catch(err => console.error("无法复制:", err));
  };

  // 下载完整分镜 JSON
  const handleDownloadJSON = () => {
    if (!currentStoryboard || scenes.length === 0) return;
    const fullData = {
      storyboard: currentStoryboard,
      scenes: scenes
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStoryboard.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 仅下载 Prompt 合集
  const handleDownloadPrompts = () => {
    if (scenes.length === 0) return;
    const text = scenes.map(s => `【镜头 ${s.scene_number}】\n${s.jimeng_prompt}\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `即梦AI中文Prompts合集.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 一键导出剪映标准字幕 (.srt) (New Feature)
  const handleExportSRT = () => {
    if (scenes.length === 0 || !currentStoryboard) return;
    
    let srtContent = '';
    let cumulativeTime = 0;
    
    scenes.forEach((scene, index) => {
      const dialogue = scene.dialogue || '（旁白或空白对白）';
      // 智能字数估算时间轴：假设常人平均每秒朗读3.5个中文字，最少持续3秒以保证字幕可读性
      const charCount = dialogue.replace(/[^\x00-\xff]/g, "xx").length / 2; // 中文字数估算
      const duration = Math.max(3, Math.ceil(charCount / 3.5));
      
      const startTimeStr = formatSRTTime(cumulativeTime);
      const endTimeStr = formatSRTTime(cumulativeTime + duration);
      
      srtContent += `${index + 1}\n`;
      srtContent += `${startTimeStr} --> ${endTimeStr}\n`;
      srtContent += `${dialogue}\n\n`;
      
      cumulativeTime += duration;
    });
    
    const blob = new Blob([srtContent], { type: 'text/srt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `剪映字幕轨道_${currentStoryboard.title.replace(/\s+/g, '_')}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 格式化秒为 SRT 标准时间字符串 HH:MM:SS,mmm
  const formatSRTTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  };

  // 导出剪映音响配音向导 (.txt) (New Feature)
  const handleExportAudioGuide = () => {
    if (scenes.length === 0 || !currentStoryboard) return;
    
    let guideContent = `==========================================================================
                 2026 AI漫剧导演工作台 - 剪映专业版配音与音轨导入向导
==========================================================================
剧本主旨: ${currentStoryboard.title}
导出时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}
==========================================================================

💡 使用向导说明：
1. 导入字幕：在剪映中【新建草稿】后，点击【文本 -> 导入字幕】，选择我们为您生成的同名 .srt 文件。
2. 匹配配音：根据下方给出的时间区间与推荐发音人，在剪映“智能朗读”中选中对应字幕段落一键朗读！
3. 设计音效：在对应的镜头区间中，搜索下方建议的背景音轨或音效，拖入音频轨道即可！

==========================================================================\n\n`;

    let cumulativeTime = 0;
    
    scenes.forEach((scene) => {
      const dialogue = scene.dialogue || '（无对白）';
      const charCount = dialogue.replace(/[^\x00-\xff]/g, "xx").length / 2;
      const duration = Math.max(3, Math.ceil(charCount / 3.5));
      
      const startTimeStr = formatSRTTime(cumulativeTime).split(',')[0];
      const endTimeStr = formatSRTTime(cumulativeTime + duration).split(',')[0];
      
      guideContent += `【镜头 SCENE #${scene.scene_number}】---------------------------------------\n`;
      guideContent += `⏱️ 时间刻度: [${startTimeStr}] ➔ [${endTimeStr}] (预估时长: ${duration}秒)\n`;
      guideContent += `👥 出镜人物: ${scene.character_on_screen || '无'}\n`;
      guideContent += `🎙️ 剪映发音人推荐: 【 ${scene.jianying_voice || '冷酷男神'} 】\n`;
      guideContent += `💬 配音字幕台词:\n   “ ${dialogue} ”\n`;
      guideContent += `🎵 建议背景音效 & BGM:\n   ↳ ${scene.sound_effects || '无'}\n`;
      guideContent += `🎨 即梦出图 Prompt (备用复制):\n   ${scene.jimeng_prompt}\n\n`;
      
      cumulativeTime += duration;
    });
    
    guideContent += `==========================================================================
                              AI Comic Director Studio · 祝您的漫剧火爆抖音与视频号！`;
    
    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `剪映配音与音效向导_${currentStoryboard.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 弹出编辑窗口
  const handleEditClick = (scene) => {
    setEditingScene({ ...scene });
  };

  // 保存二次编辑的分镜卡片
  const handleSaveScene = async () => {
    if (!editingScene) return;
    
    // 更新本地状态
    const updatedScenes = scenes.map(s => 
      s.scene_number === editingScene.scene_number ? editingScene : s
    );
    
    setScenes(updatedScenes);
    setEditingScene(null);

    // 同步到后端 SQLite
    try {
      await fetch(`/api/storyboard/${currentStoryboard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenes: updatedScenes
        })
      });
    } catch (err) {
      console.error("持久化修改失败:", err);
    }
  };

  return (
    <div className="app-container">
      {/* 头部导航区域 */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon-box">
            <Zap className="brand-icon" style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              AI Comic <span>Director Studio</span>
            </h1>
            <p className="brand-subtitle">2026 AI漫剧国内创业智脑分镜终端 v2.0</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            onClick={() => setShowDrawer(!showDrawer)} 
            className={`btn-cyber-secondary ${showDrawer ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings style={{ width: '15px', height: '15px' }} />
            <span>高级智脑与风格配置舱</span>
          </button>
        </div>
      </header>

      {/* 右侧滑动智脑与风格配置舱 (v4.0 Premium Sliding Drawer) */}
      <div className={`drawer-overlay ${showDrawer ? 'open' : ''}`} onClick={() => setShowDrawer(false)}>
        <div className={`style-master-drawer glass-card ${showDrawer ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
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
                        className={`style-preset-chip ${stylePreset === preset.value ? 'active' : ''}`}
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
                        className={`btn-seed-lock ${seedLocked ? 'locked' : ''}`}
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

      {/* 主工作区 */}
      <main className={scenes.length === 0 ? "wizard-dashboard-layout" : "dashboard-grid"}>
        {scenes.length === 0 ? (
          /* ================= STEP 1: WIZARD FLOW ================= */
          <div className="wizard-card glass-card">
            <div className="wizard-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                <Sparkles style={{ width: '22px', height: '22px', color: 'var(--primary)' }} />
                <span>步骤一：导入小说剧本与全局配置</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                在下方粘贴您的小说精彩片段，并选定全局画风与导演控制参数，开启AI漫剧创作！
              </p>
            </div>

            <div className="wizard-grid-cols">
              {/* Left Column: Script Input */}
              <div className="wizard-col-left">
                <label className="label-tech" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  原始小说片段 (Novel Text Input)
                </label>
                <div className="textarea-container">
                  <textarea 
                    value={novelText}
                    onChange={(e) => setNovelText(e.target.value)}
                    placeholder="在此黏贴热门修仙小说的精彩片段或大纲..."
                    className="textarea-tech"
                    style={{ height: '320px' }}
                  />
                  <span className="char-counter">
                    {novelText.length} 字
                  </span>
                </div>
                <div className="badge-container" style={{ marginTop: '12px' }}>
                  <span className="badge-cyber badge-cyber-blue">修仙系统绑定预设</span>
                  <span className="badge-cyber badge-cyber-gold">唯美写实国风动漫</span>
                </div>
              </div>

              {/* Right Column: Style & Director settings */}
              <div className="wizard-col-right" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label className="label-tech" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                    步骤二：全局画风选择 (Style Presets)
                  </label>
                  <div className="style-preset-grid-wizard">
                    {STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        className={`style-preset-chip-wizard ${stylePreset === preset.value ? 'active' : ''}`}
                        onClick={() => setStylePreset(preset.value)}
                        title={preset.desc}
                      >
                        <span style={{ fontWeight: 'bold' }}>{preset.label}</span>
                        <span className="preset-desc-small">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="wizard-row-settings">
                  <div style={{ flex: 1 }}>
                    <label className="label-tech">种子锁定 (Seed)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="number"
                        className="seed-input"
                        style={{ width: '100%', height: '36px' }}
                        value={masterSeed}
                        onChange={(e) => setMasterSeed(parseInt(e.target.value) || -1)}
                        disabled={seedLocked}
                      />
                      <button
                        type="button"
                        className={`btn-seed-lock ${seedLocked ? 'locked' : ''}`}
                        onClick={() => setSeedLocked(!seedLocked)}
                        title={seedLocked ? '解锁种子' : '锁定种子'}
                        style={{ height: '36px', width: '36px', display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '10px' }}
                      >
                        {seedLocked ? <Lock style={{ width: '14px', height: '14px' }} /> : <Unlock style={{ width: '14px', height: '14px' }} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 2 }}>
                    <label className="label-tech">风格参考图 URL (SREF)</label>
                    <input
                      type="text"
                      className="seed-input"
                      style={{ width: '100%', height: '36px', marginTop: '6px' }}
                      value={styleRefUrl}
                      onChange={(e) => setStyleRefUrl(e.target.value)}
                      placeholder="粘贴风格参考图 URL..."
                    />
                  </div>
                </div>

                {/* Inline Advanced Keys Accordion */}
                <div className="wizard-keys-panel">
                  <button 
                    type="button"
                    className="btn-keys-toggle" 
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings style={{ width: '13px', height: '13px' }} /> 
                    <span>{showSettings ? '隐藏高级智脑 API 密钥配置' : '展开高级智脑 API 密钥配置'}</span>
                  </button>
                  
                  {showSettings && (
                    <div className="wizard-keys-grid">
                      <div className="form-group-wizard">
                        <span className="label-tech-wizard">LLM Key</span>
                        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="DeepSeek API Key" className="input-tech-small" />
                      </div>
                      <div className="form-group-wizard">
                        <span className="label-tech-wizard">生图 Key</span>
                        <input type="password" value={imageApiKey} onChange={e => setImageApiKey(e.target.value)} placeholder="SiliconFlow T2I Key" className="input-tech-small" />
                      </div>
                      <div className="form-group-wizard">
                        <span className="label-tech-wizard">生视频 Key</span>
                        <input type="password" value={videoApiKey} onChange={e => setVideoApiKey(e.target.value)} placeholder="SiliconFlow T2V Key" className="input-tech-small" />
                      </div>
                      <div className="form-group-wizard">
                        <span className="label-tech-wizard">配音 Key</span>
                        <input type="password" value={ttsApiKey} onChange={e => setTtsApiKey(e.target.value)} placeholder="SiliconFlow TTS Key" className="input-tech-small" />
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !novelText.trim()}
                  className="btn-cyber"
                  style={{ width: '100%', height: '48px', fontSize: '15px' }}
                >
                  <Sparkles style={{ width: '18px', height: '18px' }} />
                  <span>一键智脑分镜化 (Run Director AI)</span>
                </button>
              </div>
            </div>

            {/* Slate-colored history section at the bottom */}
            {historyList.length > 0 && (
              <div className="wizard-history-footer">
                <h4 className="wizard-history-title">
                  <History style={{ width: '14px', height: '14px', color: 'var(--secondary)' }} /> 
                  <span>快速载入历史创作记录 (SQLite)</span>
                </h4>
                <div className="wizard-history-scroll">
                  {historyList.map((hist) => (
                    <div key={hist.id} className="wizard-history-chip" onClick={() => handleSelectHistory(hist.id)}>
                      <span className="wizard-history-chip-title">{hist.title}</span>
                      <span className="wizard-history-chip-time">
                        {new Date(hist.created_at).toLocaleDateString('zh-CN')}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteHistory(e, hist.id); }}
                        className="wizard-history-chip-delete"
                        title="删除记录"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= STEP 2: ACTIVE DUAL-COLUMN WORKSPACE ================= */
          <>
            {/* 左侧控制台 */}
            <aside className="sidebar-layout">
              {/* SQLite 历史记录面板 (已生成状态下为精简可收纳) */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '180px', padding: '16px' }}>
                <h3 className="history-section-title" style={{ fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History style={{ width: '13px', height: '13px', color: 'var(--secondary)' }} /> 
                    <span> SQLite 剧本历史记录</span>
                  </span>
                </h3>
                <div className="history-list" style={{ flexGrow: 1, maxHeight: '110px', overflowY: 'auto' }}>
                  {historyList.map((hist) => (
                    <div 
                      key={hist.id} 
                      onClick={() => handleSelectHistory(hist.id)}
                      className={`history-item ${currentStoryboard && currentStoryboard.id === hist.id ? 'active' : ''}`}
                      style={{ padding: '8px 10px', marginBottom: '4px' }}
                    >
                      <span className="history-item-title" style={{ fontSize: '11px' }}>{hist.title}</span>
                      <button 
                        onClick={(e) => handleDeleteHistory(e, hist.id)}
                        className="btn-delete-history"
                        style={{ padding: '2px' }}
                      >
                        <Trash2 style={{ width: '11px', height: '11px' }} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="btn-cyber-secondary"
                  style={{ width: '100%', marginTop: '10px', fontSize: '11px', padding: '6px', height: '28px' }}
                  onClick={() => {
                    setCurrentStoryboard(null);
                    setScenes([]);
                  }}
                >
                  + 新建分镜剧本
                </button>
              </div>

              
              {/* 素材指引 (Asset Cosmos Panel) */}
              <div className="asset-cosmos-panel" style={{ marginTop: '10px' }}>
                <div className="sidebar-section-title">
                  <User style={{ width: '13px', height: '13px', color: 'var(--accent)' }} />
                  <span>素材资产宇宙 (Assets Cosmos)</span>
                </div>
                
                <div className="asset-cosmos-header">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🎭 演员角色 ({characters.length})</span>
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
                  {characters.length === 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', padding: '6px' }}>暂无角色，点击加号添加</span>
                  )}
                </div>

                <div className="asset-cosmos-header" style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🏞️ 空间场景 ({sceneryList.length})</span>
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
                  {sceneryList.length === 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', padding: '6px' }}>暂无场景，点击加号添加</span>
                  )}
                </div>
              </div>

              {/* 后期音轨与专业打包舱 */}
              <div className="sidebar-audio-suite" style={{ marginTop: '10px' }}>
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
                
                <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', gap: '8px' }}>
                  <label htmlFor="sidebar-bgm-upload" className="btn-cosmos-add" style={{ textAlign: 'center', flex: 1, padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Upload style={{ width: '10px', height: '10px' }} />
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
                      <span style={{ fontWeight: 'bold' }}>{synthesizeProgress}%</span>
                    </div>
                    <div className="synth-progress-track-large" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div className="synth-progress-bar-large" style={{ width: `${synthesizeProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.15s ease' }}></div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-cyber"
                    onClick={handleBatchSynthesizeTTS}
                    style={{ width: '100%', height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
                  className="btn-export-cyan"
                  onClick={handleExportJianyingDraft}
                  disabled={exportingJianying}
                  style={{ width: '100%', height: '34px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00f2fe', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '2px' }}>
                  <button type="button" onClick={handleExportSRT} className="btn-cosmos-add" style={{ padding: '4px 0', fontSize: '10px' }}>字幕轨 (.srt)</button>
                  <button type="button" onClick={handleDownloadJSON} className="btn-cosmos-add" style={{ padding: '4px 0', fontSize: '10px' }}>备份工程 (.json)</button>
                </div>
              </div>
            </aside>

            {/* 右侧展示面板 */}
            <section className="workspace-layout">
          
          {/* 中控与分镜信息栏 */}
          <div className="glass-card workspace-topbar">
            <div className="workspace-title-box">
              <h2 className={`workspace-title ${!currentStoryboard ? 'empty' : ''}`}>
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
                    className={`btn-view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                  >
                    <List style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                  >
                    <Grid style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>

                <button 
                  onClick={handleExportSRT}
                  className="btn-cyber-secondary"
                  style={{ borderColor: 'rgba(185, 39, 252, 0.4)', color: '#d182ff' }}
                >
                  <Download style={{ width: '13px', height: '13px' }} /> 一键导出剪映字幕 (.srt)
                </button>

                <button 
                  onClick={handleExportAudioGuide}
                  className="btn-cyber-secondary"
                  style={{ borderColor: 'rgba(255, 215, 0, 0.4)', color: 'var(--accent)' }}
                >
                  <Download style={{ width: '13px', height: '13px' }} /> 剪映配音音效向导 (.txt)
                </button>

                <button 
                  onClick={handleDownloadPrompts}
                  className="btn-cyber-secondary"
                >
                  <Download style={{ width: '13px', height: '13px' }} /> 导出 Prompts (.txt)
                </button>
                
                <button 
                  onClick={handleDownloadJSON}
                  className="btn-cyber-secondary"
                  style={{ borderColor: 'rgba(0, 242, 254, 0.4)', color: 'var(--primary)' }}
                >
                  <Download style={{ width: '13px', height: '13px' }} /> 导出分镜 JSON
                </button>
              </div>
            )}
          </div>

          {/* 加载中状态 */}
          {loading && (
            <div className="glass-card workspace-loader">
              <div className="loader-ring"></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p className="loader-title">Director AI Brain Active...</p>
                <p className="loader-step">{loadingStep}</p>
              </div>
              <div className="loader-progress-track">
                <div className="loader-progress-bar"></div>
              </div>
            </div>
          )}

          {/* 无分镜初始态 */}
          {!loading && scenes.length === 0 && (
            <div className="glass-card workspace-empty-state">
              <div className="empty-state-icon-circle">
                <Sparkles style={{ width: '36px', height: '36px' }} />
                <div className="empty-state-pulse"></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 className="empty-state-title">AI 漫剧导演创作中心</h3>
                <p className="empty-state-desc">
                  在左侧输入您喜欢的修仙小说的精彩片段或高燃冲突，配置您的 DeepSeek API（留空亦可），随后点击【一键智脑分镜化】开始创作！
                </p>
              </div>
              <div className="empty-state-db-status">
                <Database style={{ width: '14px', height: '14px' }} /> SQLite 数据库已连接 · 随时自动保存数据
              </div>
            </div>
          )}

          {/* 分镜卡片展示区域 */}
          {!loading && scenes.length > 0 && (
            <div style={{ width: '100%' }}>
              {viewMode === 'cards' ? (
                // 1. 卡片流模式 (Timeline View)
                <div className="scenes-container">
                  {scenes.map((scene, idx) => (
                    <div 
                      key={scene.id || scene.scene_number} 
                      className="scene-card"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      {/* 左侧：画面视觉预览舱 */}
                      <div className="scene-card-left">
                        <div className="concept-frame" style={{ cursor: 'pointer' }}>
                          
                           {/* 渲染真实的生成视频或图片 */}
                          {scene.video_url ? (
                            <video 
                              src={scene.video_url}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} 
                            />
                          ) : scene.image_url ? (
                            <img 
                              src={scene.image_url} 
                              alt={`Scene ${scene.scene_number}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} 
                            />
                          ) : (
                            <div className="concept-glow"></div>
                          )}

                          <div className="concept-meta-top" style={{ zIndex: 3 }}>
                            <span className="badge-scene-num">SCENE {String(scene.scene_number).padStart(2, '0')}</span>
                            <span className="badge-camera" title={scene.camera_direction}>{scene.camera_direction}</span>
                          </div>

                          {/* 悬浮一键视频生成按钮 */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateVideo(scene.id, scene.jimeng_prompt, scene.image_url);
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              zIndex: 3,
                              background: 'rgba(3, 4, 8, 0.75)',
                              border: '1px solid rgba(255, 185, 56, 0.3)',
                              borderRadius: '4px',
                              padding: '4px 6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '9px',
                              color: '#ffb938',
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            title="点击一键利用AI视频大模型渲染动态画面"
                            className="hover:scale-105"
                          >
                            {generatingVideoSceneId === scene.id ? (
                              <>
                                <RefreshCw className="animate-spin" style={{ width: '10px', height: '10px' }} />
                                <span>生视频中...</span>
                              </>
                            ) : (
                              <>
                                <Tv style={{ width: '10px', height: '10px' }} />
                                <span>{scene.video_url ? '重新视频' : '一键视频'}</span>
                              </>
                            )}
                          </div>

                          {/* 悬浮一键渲染生图按钮 */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateImage(scene.id, scene.jimeng_prompt);
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              zIndex: 3,
                              background: 'rgba(3, 4, 8, 0.75)',
                              border: '1px solid rgba(0, 242, 254, 0.3)',
                              borderRadius: '4px',
                              padding: '4px 6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '9px',
                              color: 'var(--primary)',
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            title="点击一键渲染当前分镜真实画面"
                            className="hover:scale-105"
                          >
                            {generatingImageSceneId === scene.id ? (
                              <>
                                <RefreshCw className="animate-spin" style={{ width: '10px', height: '10px' }} />
                                <span>生图中...</span>
                              </>
                            ) : (
                              <>
                                <Image style={{ width: '10px', height: '10px' }} />
                                <span>{scene.image_url ? '重新生图' : '一键生图'}</span>
                              </>
                            )}
                          </div>

                          {/* I2V Arrow Connector */}
                          {scene.image_url && !scene.video_url && (
                            <div className="i2v-arrow-connector">
                              <Film style={{ width: '8px', height: '8px' }} />
                              I2V
                            </div>
                          )}

                          {!scene.image_url && !scene.video_url && <Sparkles className="concept-icon" style={{ width: '22px', height: '22px', zIndex: 2 }} />}
                          {!scene.image_url && !scene.video_url && <p className="concept-placeholder-text" style={{ zIndex: 2 }}>Concept Vision</p>}
                          
                          {/* Camera corners */}
                          <div className="corner-tl" style={{ zIndex: 3 }}></div>
                          <div className="corner-tr" style={{ zIndex: 3 }}></div>
                          <div className="corner-bl" style={{ zIndex: 3 }}></div>
                          <div className="corner-br" style={{ zIndex: 3 }}></div>
                        </div>

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
                                  title={`点击打开【${char.name}】定妆舱三视图与全身姿态管理`}
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
                                  title={`点击打开【${scenery.name}】空间场景原画舱管理`}
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
                      <div className="scene-card-right">
                        <div className="scene-detail-header">
                          <div className="visual-desc-box">
                            <span className="detail-label-tech">画面细节描述</span>
                            <p className="visual-desc-text">{scene.visual_description}</p>
                          </div>
                          <div>
                            <button 
                              onClick={() => handleEditClick(scene)}
                              className="btn-director-workshop-accent"
                              title="微调运镜台词、绑定人物原景"
                            >
                              <Edit style={{ width: '13px', height: '13px' }} />
                              <span>导剪工坊</span>
                            </button>
                          </div>
                        </div>

                        {/* 即梦中文提示词（高亮代码块） */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', marginTop: '6px', marginBottom: '14px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>即梦AI中文画面提示词</span>
                          <button 
                            type="button"
                            onClick={() => handleCopyPrompt(scene.jimeng_prompt, scene.id || scene.scene_number)}
                            className={`btn-cyber-tag ${copiedSceneId === (scene.id || scene.scene_number) ? 'active' : ''}`}
                            style={{ padding: '2px 8px', fontSize: '10px', height: '22px' }}
                          >
                            {copiedSceneId === (scene.id || scene.scene_number) ? '已复制 ✓' : '一键复制提示词 📋'}
                          </button>
                        </div>

                        {/* 声音和对白 */}
                        <div className="audio-columns">
                          <div className="audio-box">
                            <span className="detail-label-tech">剪映配音台词/旁白</span>
                            <p className="audio-box-body dialogue">
                              “ {scene.dialogue || '（旁白或空白对白）'} ”
                            </p>
                          </div>
                          <div className="audio-box">
                            <span className="detail-label-tech" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>背景音效/BGM建议</span>
                              <div className="wave-motion">
                                <div className="wave-bar"></div>
                                <div className="wave-bar"></div>
                                <div className="wave-bar"></div>
                                <div className="wave-bar"></div>
                              </div>
                            </span>
                            <div className="audio-box-body sfx" style={{ wordBreak: 'break-all' }}>
                              <Music style={{ width: '13px', height: '13px', color: 'rgba(0, 242, 254, 0.5)', flexShrink: 0 }} />
                              <span>{scene.sound_effects}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // 2. 导演大盘模式 (Grid Board View)
                <div className="scenes-grid-layout">
                  {scenes.map((scene, idx) => (
                    <div 
                      key={scene.id || scene.scene_number} 
                      className="scene-grid-card"
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="grid-card-head">
                        <span className="badge-scene-num">FRAME {scene.scene_number}</span>
                        <button 
                          onClick={() => handleEditClick(scene)}
                          className="btn-action-small"
                          style={{ width: '26px', height: '26px' }}
                        >
                          <Edit style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>

                      {/* 渲染真实的生成图片 */}
                      <div className="grid-card-concept-view" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                        {scene.image_url ? (
                          <img 
                            src={scene.image_url} 
                            alt={`Scene ${scene.scene_number}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} 
                          />
                        ) : null}
                        
                        <div style={{ position: 'relative', zIndex: 2, background: scene.image_url ? 'rgba(3,4,8,0.7)' : 'transparent', padding: '6px', borderRadius: '6px', width: '100%' }}>
                          <span className="grid-card-concept-title">{scene.camera_direction}</span>
                          <p className="grid-card-concept-desc" style={{ color: scene.image_url ? '#fff' : 'var(--text-muted)' }}>{scene.visual_description}</p>
                        </div>

                        {/* 生图悬浮按钮 */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateImage(scene.id, scene.jimeng_prompt);
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '6px',
                            right: '6px',
                            zIndex: 3,
                            background: 'rgba(3, 4, 8, 0.85)',
                            border: '1px solid rgba(0, 242, 254, 0.25)',
                            borderRadius: '4px',
                            padding: '3px 5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '8px',
                            color: 'var(--primary)',
                            fontWeight: 'bold',
                          }}
                        >
                          {generatingImageSceneId === scene.id ? (
                            <RefreshCw className="animate-spin" style={{ width: '8px', height: '8px' }} />
                          ) : (
                            <Image style={{ width: '8px', height: '8px' }} />
                          )}
                          <span>{scene.image_url ? '重绘' : '渲染'}</span>
                        </div>
                      </div>

                      <div className="grid-prompt-box">
                        <div className="grid-prompt-head">
                          <span className="detail-label-tech">即梦中文 Prompt</span>
                          <button 
                            onClick={() => handleCopyPrompt(scene.jimeng_prompt, scene.id || scene.scene_number)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                          >
                            {copiedSceneId === (scene.id || scene.scene_number) ? '已复制!' : '复制'}
                          </button>
                        </div>
                        <p className="grid-prompt-text">
                          {scene.jimeng_prompt}
                        </p>
                      </div>

                      <div className="grid-card-footer">
                        <div className="grid-card-meta-row">
                          <span 
                            onClick={() => playVoicePreview(scene.jianying_voice || '冷酷男神')}
                            className="badge-cyber badge-cyber-purple"
                            style={{ cursor: 'pointer' }}
                          >
                            🎙️ {scene.jianying_voice} 🔊
                          </span>
                          <span className="detail-label-tech">BGM SFX</span>
                        </div>
                        <p className="grid-dialogue-text">
                          “ {scene.dialogue} ”
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </section>
          </>
        )}
      </main>

      {/* 底部版权信息 */}
      <footer className="app-footer">
        © 2026 AI漫剧导演工作台 - 开源创业套件 · 基于 React + Vite + Express + SQLite
      </footer>

      {/* 二次编辑弹出框 (Glassmorphism Edit Modal) */}
      {editingScene && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <Edit style={{ width: '16px', height: '16px' }} /> 二次微调：分镜镜头 SCENE #{editingScene.scene_number}
              </h3>
              <button 
                onClick={() => setEditingScene(null)} 
                className="btn-modal-close"
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '520px' }}>
              <div className="modal-two-columns">
                
                {/* 左侧专栏：镜头物理特征与生图 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="modal-row-grid-2">
                    <div className="form-group">
                      <label className="label-tech">镜头运动/景别</label>
                      <input 
                        type="text" 
                        value={editingScene.camera_direction} 
                        onChange={(e) => setEditingScene({ ...editingScene, camera_direction: e.target.value })} 
                        className="input-tech"
                      />
                    </div>
                    <div className="form-group">
                      <label className="label-tech">出镜人物 (自由编辑)</label>
                      <input 
                        type="text" 
                        value={editingScene.character_on_screen} 
                        onChange={(e) => setEditingScene({ ...editingScene, character_on_screen: e.target.value })} 
                        className="input-tech"
                      />
                    </div>
                  </div>

                  {/* 演员一键绑定 */}
                  <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '4px' }}>
                    <label className="label-tech" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <User style={{ width: '12px', height: '12px', color: 'var(--accent)' }} />
                      <span>快捷绑定档案舱演员 (高一致性参考词注入)</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {characters.map(char => {
                        const charIds = editingScene.character_ids ? editingScene.character_ids.split(',').map(id => parseInt(id, 10)) : [];
                        const isLinked = charIds.includes(char.id);
                        
                        return (
                          <button
                            key={char.id}
                            type="button"
                            onClick={() => {
                              let nextCharIds = [...charIds];
                              if (isLinked) {
                                nextCharIds = nextCharIds.filter(id => id !== char.id);
                              } else {
                                nextCharIds.push(char.id);
                              }
                              
                              // Rebuild character_ids
                              const nextCharIdsStr = nextCharIds.join(',');
                              
                              // Rebuild character_on_screen from active characters
                              const linkedChars = characters.filter(c => nextCharIds.includes(c.id));
                              const nextCharOnScreen = linkedChars.map(c => c.name).join(', ') || '无';
                              
                              setEditingScene({
                                ...editingScene,
                                character_ids: nextCharIdsStr,
                                character_on_screen: nextCharOnScreen
                              });
                            }}
                            className={`btn-cyber-tag ${isLinked ? 'active' : ''}`}
                            style={{
                              padding: '3px 8px',
                              fontSize: '10px',
                              borderRadius: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: isLinked ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                              background: isLinked ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0,0,0,0.2)',
                              color: isLinked ? '#fff' : 'var(--text-muted)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {char.avatar_url ? (
                              <img src={char.avatar_url} alt="" style={{ width: '12px', height: '12px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <User style={{ width: '8px', height: '8px' }} />
                            )}
                            <span>{char.name}</span>
                          </button>
                        );
                      })}
                      {characters.length === 0 && (
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>暂无角色档案，请在左侧演员舱添加</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label-tech">画面细节描述</label>
                    <textarea 
                      value={editingScene.visual_description} 
                      onChange={(e) => setEditingScene({ ...editingScene, visual_description: e.target.value })} 
                      className="textarea-tech"
                      style={{ height: '70px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label-tech">即梦AI (Jimeng AI) 中文提示词</label>
                    <textarea 
                      value={editingScene.jimeng_prompt} 
                      onChange={(e) => setEditingScene({ ...editingScene, jimeng_prompt: e.target.value })} 
                      className="textarea-tech"
                      style={{ height: '80px', fontFamily: 'monospace', color: 'var(--primary)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label-tech">动态生视频 Prompt/生成地址</label>
                    <input 
                      type="text" 
                      value={editingScene.video_url || ''} 
                      onChange={(e) => setEditingScene({ ...editingScene, video_url: e.target.value })} 
                      placeholder="未生成（一键生视频后自动在此保存链接）"
                      className="input-tech"
                    />
                  </div>
                </div>

                {/* 右侧专栏：声音艺术设计与台词 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <label className="label-tech">
                      <span>剪映推荐音色 (点击任一音色即可选中并试听 🔊)</span>
                    </label>
                    <div className="voice-selector-container" style={{ maxHeight: '180px' }}>
                      <div className="voice-grid">
                        {VOICES_CONFIG.map((voice) => {
                          const isSelected = editingScene.jianying_voice === voice.name;
                          return (
                            <div 
                              key={voice.name}
                              onClick={() => {
                                setEditingScene({ ...editingScene, jianying_voice: voice.name });
                                playVoicePreview(voice.name);
                              }}
                              className={`voice-card ${isSelected ? 'selected' : ''}`}
                              title={`点击选择并试听【${voice.name}】`}
                            >
                              <div className="voice-card-content">
                                <span className="voice-avatar">{voice.emoji}</span>
                                <div className="voice-info">
                                  <span className="voice-name">{voice.name}</span>
                                  <span className="voice-desc">{voice.desc.split(' · ')[0]}</span>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playVoicePreview(voice.name);
                                }}
                                className="voice-preview-btn"
                                title="仅试听此音色"
                              >
                                <Volume2 style={{ width: '13px', height: '13px' }} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label-tech">背景音效建议</label>
                    <input 
                      type="text" 
                      value={editingScene.sound_effects} 
                      onChange={(e) => setEditingScene({ ...editingScene, sound_effects: e.target.value })} 
                      className="input-tech"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label-tech">剪映配音台词 / 旁白</label>
                    <textarea 
                      value={editingScene.dialogue} 
                      onChange={(e) => setEditingScene({ ...editingScene, dialogue: e.target.value })} 
                      className="textarea-tech"
                      style={{ height: '70px' }}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setEditingScene(null)} 
                className="btn-cyber-secondary"
              >
                取消
              </button>
              <button 
                onClick={handleSaveScene} 
                className="btn-cyber"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* I2V Consistency Warning Modal */}
      {showConsistencyWarning && (
        <div className="modal-overlay">
          <div className="consistency-warning-modal">
            <div className="consistency-warning-icon">
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ffb938' }} />
            </div>
            <h3 className="consistency-warning-title">视觉一致性风控拦截</h3>
            <p className="consistency-warning-desc">
              当前分镜尚未生成静态图片。直接生成视频将无法使用 I2V（图生视频）模式，可能导致角色外貌不一致。<br/>
              建议先生成静态图片，再基于图片生成视频，以确保角色外貌和场景一致性。
            </p>
            <div className="consistency-warning-actions">
              <button
                className="btn-cyber"
                onClick={() => {
                  setShowConsistencyWarning(false);
                  const scene = scenes.find(s => s.id === consistencyWarningSceneId);
                  if (scene) handleGenerateImage(scene.id, scene.jimeng_prompt);
                  setConsistencyWarningSceneId(null);
                }}
              >
                <Shield style={{ width: '14px', height: '14px' }} />
                先生成图片（推荐）
              </button>
              <button
                className="btn-cyber-secondary"
                style={{ borderColor: 'rgba(255, 185, 56, 0.4)', color: '#ffb938' }}
                onClick={() => {
                  const scene = scenes.find(s => s.id === consistencyWarningSceneId);
                  if (scene) handleForceGenerateVideo(scene.id, scene.jimeng_prompt);
                }}
              >
                <AlertTriangle style={{ width: '14px', height: '14px' }} />
                强制生成视频（跳过 I2V）
              </button>
              <button
                className="btn-cyber-secondary"
                onClick={() => { setShowConsistencyWarning(false); setConsistencyWarningSceneId(null); }}
              >
                <X style={{ width: '14px', height: '14px' }} />
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* 资产定妆/精修空间舱 (Asset Refiner Cabin Modal) */}
      {activeAssetModal && (
        <div className="modal-overlay" onClick={() => setActiveAssetModal(null)} style={{ zIndex: 2999, background: 'rgba(3, 4, 8, 0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className={`asset-refiner-modal ${activeAssetModal.type === 'scenery' ? 'scenery-type' : ''}`} 
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
  {/* Lightbox Image Preview Modal */}
      {previewImageUrl && (
        <div className="modal-overlay" onClick={() => setPreviewImageUrl(null)} style={{ zIndex: 9999, background: 'rgba(3, 4, 8, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '85vw', width: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={previewImageUrl} 
              alt="预览图" 
              style={{ maxWidth: '100%', maxHeight: '82vh', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 60px rgba(0,0,0,0.85)', objectFit: 'contain' }} 
            />
            <button 
              onClick={() => setPreviewImageUrl(null)} 
              className="btn-modal-close"
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'rgba(225, 29, 72, 0.95)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="关闭预览"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
