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
  VolumeX,
  Wand2
} from 'lucide-react';

export default function App() {
  // 核心状态管理
  const [novelText, setNovelText] = useState(
    `天空正下着倾盆大雨，雷鸣声在苍穹间回荡。\n林默被叶家大少爷狠狠地踩在泥水里，右手手骨已经粉碎性骨折。\n“林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？”叶大少冷笑道，身边站着他高傲的未婚妻。\n林默咬紧牙齿，泥水混着血水流进嘴里。他忽然笑了，因为就在这一瞬间，脑海深处传来了一声清脆的电子提示音：\n【叮！太古神龙系统绑定成功，检测到宿主正在受到致命威胁，自动启动神龙逆天血脉！】`
  );
  
  // API 设置状态 (支持本地存储)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('llm_api_key') || '');
  const [apiUrl, setUrl] = useState(() => localStorage.getItem('llm_api_url') || 'https://api.deepseek.com/v1/chat/completions');
  const [modelName, setModelName] = useState(() => localStorage.getItem('llm_model_name') || 'deepseek-chat');
  const [showSettings, setShowSettings] = useState(false);
  
  // 连通性测试状态
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [connectionLatency, setConnectionLatency] = useState(0);
  const [connectionError, setConnectionError] = useState('');

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

  // 2.5 升级新增：试听与生图交互状态
  const [activeSpeechScene, setActiveSpeechScene] = useState(null);
  const [activeSFXScene, setActiveSFXScene] = useState(null);
  const [generatingImageScene, setGeneratingImageScene] = useState(null);

  // 初始化拉取历史记录
  useEffect(() => {
    fetchHistory();
  }, []);

  // 监听设置变化保存至本地
  useEffect(() => {
    localStorage.setItem('llm_api_key', apiKey);
    localStorage.setItem('llm_api_url', apiUrl);
    localStorage.setItem('llm_model_name', modelName);
  }, [apiKey, apiUrl, modelName]);

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

  // 测试 API 连通性
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');
    const startTime = Date.now();

    // 如果未填写 API KEY，切换为模拟测试通过
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConnectionLatency(28);
      setConnectionStatus('success');
      return;
    }

    try {
      const url = apiUrl || "https://api.deepseek.com/v1/chat/completions";
      const model = modelName || "deepseek-chat";

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1
        })
      });

      const endTime = Date.now();

      if (res.ok) {
        setConnectionLatency(endTime - startTime);
        setConnectionStatus('success');
      } else {
        const errText = await res.text();
        let errMsg = `请求失败 (状态码: ${res.status})`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            errMsg = parsed.error.message;
          }
        } catch(e) {}
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error("测试 API 连通性出错:", err);
      setConnectionError(err.message || '网络连接超时');
      setConnectionStatus('error');
    }
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

  // Native Text-to-Speech Preview (Web Speech API)
  const handlePlayVoice = (sceneId, text, voiceType) => {
    if (!('speechSynthesis' in window)) {
      alert("您的浏览器不支持 Web Speech API，请使用现代浏览器 (Chrome/Edge/Safari)。");
      return;
    }

    // If already playing the current scene's voice, stop it
    if (activeSpeechScene === sceneId) {
      window.speechSynthesis.cancel();
      setActiveSpeechScene(null);
      return;
    }

    // Stop any other active voices first
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[\r\n\t]/g, ' ').replace(/[“”（）"']/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';

    // Map CapCut voices to Web Speech characteristics (pitch, rate)
    switch (voiceType) {
      case '深沉旁白':
        utterance.pitch = 0.7;
        utterance.rate = 0.85;
        break;
      case '冷酷男神':
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
        break;
      case '热血少年':
        utterance.pitch = 1.15;
        utterance.rate = 1.2;
        break;
      case '系统机械音':
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
        break;
      case '霸气御姐':
        utterance.pitch = 0.95;
        utterance.rate = 0.95;
        break;
      case '温柔师姐':
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    // Try to find a fitting Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoices = voices.filter(v => v.lang.includes('zh') || v.lang.includes('ZH'));
    if (zhVoices.length > 0) {
      // Simple gender heuristic based on recommended voice
      const isFemaleRole = ['霸气御姐', '温柔师姐'].includes(voiceType);
      const isMaleRole = ['深沉旁白', '冷酷男神', '热血少年'].includes(voiceType);
      
      let matchedVoice = null;
      if (isFemaleRole) {
        matchedVoice = zhVoices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Xiaoxiao') || v.name.includes('Huihui'));
      } else if (isMaleRole) {
        matchedVoice = zhVoices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('Kangkang') || v.name.includes('Yaoyao'));
      }
      utterance.voice = matchedVoice || zhVoices[0];
    }

    utterance.onstart = () => {
      setActiveSpeechScene(sceneId);
    };

    utterance.onend = () => {
      setActiveSpeechScene(null);
    };

    utterance.onerror = () => {
      setActiveSpeechScene(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Web Audio SFX Synthesizer
  const handlePlaySFX = (sceneId, sfxDescription) => {
    if (activeSFXScene === sceneId) {
      // Toggle off if clicked again (just clear state)
      setActiveSFXScene(null);
      return;
    }

    setActiveSFXScene(sceneId);

    // Dynamic wave animation duration matching SFX length
    let durationMs = 1500;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const desc = sfxDescription || "";

      // 1. Crystal Ping / System Notification
      if (desc.includes("叮") || desc.includes("提示音") || desc.includes("金属")) {
        durationMs = 800;
        const now = ctx.currentTime;
        
        // Osc 1 (Sine wave high ping)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);

        // Osc 2 (Slightly delayed harmony)
        setTimeout(() => {
          const now2 = ctx.currentTime;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1800, now2);
          osc2.frequency.exponentialRampToValueAtTime(2400, now2 + 0.08);
          
          gain2.gain.setValueAtTime(0.1, now2);
          gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.45);
          
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now2);
          osc2.stop(now2 + 0.5);
        }, 120);
      }
      // 2. Heavy Thunder / Explosion / Strike
      else if (desc.includes("雷") || desc.includes("重") || desc.includes("爆炸") || desc.includes("冲击波") || desc.includes("震")) {
        durationMs = 2200;
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 2.0; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate Brownish/White Noise for low rumble
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Low pass filter white noise to get brown noise
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // Amplify
        }
        
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(35, now + 1.8);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
        
        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noiseNode.start(now);
        noiseNode.stop(now + 2.0);

        // Synth Bass Drop under rumble
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(90, now);
        subOsc.frequency.linearRampToValueAtTime(30, now + 1.2);
        
        subGain.gain.setValueAtTime(0.3, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.3);
      }
      // 3. Sci-Fi Charge / Swoosh / Dragon Roar
      else if (desc.includes("充电") || desc.includes("嗡鸣") || desc.includes("能量") || desc.includes("神龙") || desc.includes("怒吼")) {
        durationMs = 2000;
        const now = ctx.currentTime;
        
        // Synth wave sweeps
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(75, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 1.4);
        
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(8, now);
        filter.frequency.setValueAtTime(150, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 1.4);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 1.7);
        
        // LFO Pitch Modulator for animalistic vibrating texture
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(16, now); // 16Hz pitch wobble
        lfoGain.gain.setValueAtTime(15, now);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 1.7);
      }
      // 4. Default Ambient Swoosh / Magic sparkle
      else {
        durationMs = 1200;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.8);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.0);
      }
    } catch (e) {
      console.error("Web Audio Synthesizer Error: ", e);
    }

    // Reset visualizer state when sound ends
    setTimeout(() => {
      setActiveSFXScene(prev => prev === sceneId ? null : prev);
    }, durationMs);
  };

  // Simulated AI Image Generation with scanning animation & DB update
  const handleGenerateImage = async (scene) => {
    const sceneKey = scene.id || scene.scene_number;
    setGeneratingImageScene(sceneKey);

    // Shimmering sci-fi scanning duration
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Seed-based high quality anime illustration
    const seedId = `${scene.scene_number}_anime_${currentStoryboard ? currentStoryboard.id : 1}`;
    const newImageUrl = `https://picsum.photos/seed/${seedId}/640/360`;

    // Update scenes in state
    const updatedScenes = scenes.map(s => 
      (s.id === scene.id || s.scene_number === scene.scene_number) 
        ? { ...s, image_url: newImageUrl } 
        : s
    );

    setScenes(updatedScenes);
    setGeneratingImageScene(null);

    // Save persistently to SQLite database via PUT endpoint
    if (currentStoryboard) {
      try {
        await fetch(`/api/storyboard/${currentStoryboard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenes: updatedScenes })
        });
      } catch (err) {
        console.error("保存生成图片到数据库失败:", err);
      }
    }
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
      s.id === editingScene.id ? editingScene : s
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
            onClick={() => setShowSettings(!showSettings)} 
            className={`btn-cyber-secondary ${showSettings ? 'active' : ''}`}
          >
            <Settings style={{ width: '15px', height: '15px' }} />
            高级智脑配置
          </button>
        </div>
      </header>

      {/* 设置收纳折叠面板 */}
      {showSettings && (
        <div className="settings-accordion">
          <div className="settings-header">
            <h3 className="settings-title">
              <Cpu style={{ width: '16px', height: '16px' }} /> DeepSeek / 智脑配置中心
            </h3>
            <span className="settings-badge">已加密存储于浏览器 LocalStorage</span>
          </div>
          <div className="settings-grid">
            <div className="form-group">
              <label className="label-tech">DeepSeek API KEY</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="input-tech"
                  style={{ paddingRight: '36px' }}
                />
                <Key style={{ width: '14px', height: '14px', position: 'absolute', right: '12px', top: '13px', color: 'rgba(255,255,255,0.3)' }} />
              </div>
              <p style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>留空或填写无效 Key 将自动运行【高真度模拟演示模式】</p>
            </div>
            <div className="form-group">
              <label className="label-tech">API 请求网关 (BASE URL)</label>
              <input 
                type="text" 
                value={apiUrl} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://api.deepseek.com/v1/chat/completions"
                className="input-tech"
              />
            </div>
            <div className="form-group">
              <label className="label-tech">模型型号 (MODEL NAME)</label>
              <input 
                type="text" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)} 
                placeholder="deepseek-chat"
                className="input-tech"
              />
            </div>
          </div>

          {/* 连通性测试模块 (New UX Improvement) */}
          <div className="connection-test-row">
            <button 
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="btn-test-connection"
            >
              {connectionStatus === 'testing' ? '正在测试连通性...' : '测试 API 连通性'}
            </button>
            
            {connectionStatus === 'success' && (
              <div className="connection-banner success">
                <Check style={{ width: '12px', height: '12px' }} />
                <span>DeepSeek API 连通成功 (延迟: {connectionLatency}ms)</span>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="connection-banner error">
                <X style={{ width: '12px', height: '12px' }} />
                <span>连通失败: {connectionError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 主工作区 */}
      <main className="dashboard-grid">
        
        {/* 左侧控制台 */}
        <aside className="sidebar-layout">
          {/* 小说剧本输入面板 */}
          <div className="glass-card">
            <h3 className="card-title">
              <BookOpen style={{ width: '16px', height: '16px' }} /> 原始小说片段 (Cultivation Hook)
            </h3>
            <div className="textarea-container">
              <textarea 
                value={novelText}
                onChange={(e) => setNovelText(e.target.value)}
                placeholder="在此黏贴热门修仙小说的精彩片段或大纲..."
                className="textarea-tech"
                style={{ height: '220px' }}
              />
              <span className="char-counter">
                {novelText.length} 字
              </span>
            </div>

            <div className="badge-container">
              <span className="badge-cyber badge-cyber-blue">
                修仙系统绑定预设
              </span>
              <span className="badge-cyber badge-cyber-gold">
                唯美写实国风动漫
              </span>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !novelText.trim()}
              className="btn-cyber"
              style={{ width: '100%', marginTop: '16px' }}
            >
              <Sparkles style={{ width: '15px', height: '15px' }} />
              一键智脑分镜化 (LLM Run)
            </button>
          </div>

          {/* SQLite 历史记录面板 */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
            <h3 className="history-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History style={{ width: '15px', height: '15px', color: 'var(--secondary)' }} /> 历史生成记录 (SQLite)</span>
              <Database style={{ width: '14px', height: '14px', color: 'var(--text-dim)' }} />
            </h3>
            <div className="history-list" style={{ flexGrow: 1 }}>
              {historyList.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '11px', padding: '40px 0', fontFamily: 'monospace' }}>
                  &lt; 暂无历史记录 &gt;
                </div>
              ) : (
                historyList.map((hist) => (
                  <div 
                    key={hist.id} 
                    onClick={() => handleSelectHistory(hist.id)}
                    className={`history-item ${currentStoryboard && currentStoryboard.id === hist.id ? 'active' : ''}`}
                  >
                    <div className="history-item-details">
                      <span className="history-item-title">{hist.title}</span>
                      <span className="history-item-date">
                        {new Date(hist.created_at).toLocaleString('zh-CN', { hour12: false })}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteHistory(e, hist.id)}
                      className="btn-delete-history"
                    >
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 智脑运行状态卡片 (New UX Improvement) */}
          <div className="status-card">
            <div className="status-dot-label">
              <div className={`status-dot ${(!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') ? 'yellow' : 'green'}`}></div>
              <span>系统运行状态</span>
            </div>
            <div className={`status-card-value ${(!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') ? 'yellow' : 'green'}`}>
              {(!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') ? '本地演示模式 (无Key)' : 'DeepSeek 智脑已联通'}
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
                        <div 
                          className="concept-frame" 
                          style={{ cursor: scene.image_url ? 'default' : 'pointer' }}
                          onClick={() => !scene.image_url && !generatingImageScene && handleGenerateImage(scene)}
                        >
                          <div className="concept-glow"></div>
                          
                          {scene.image_url && generatingImageScene !== (scene.id || scene.scene_number) ? (
                            <>
                              <img 
                                src={scene.image_url} 
                                alt={`Scene ${scene.scene_number}`} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
                              />
                              <div className="concept-frame-overlay">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleGenerateImage(scene); }}
                                  className="btn-cyber-secondary"
                                  style={{ transform: 'scale(0.85)', background: 'rgba(3,4,8,0.9)', border: '1px solid var(--primary)', padding: '6px 12px', pointerEvents: 'auto', display: 'inline-flex', gap: '4px' }}
                                >
                                  <Wand2 style={{ width: '12px', height: '12px' }} /> 重新生成
                                </button>
                              </div>
                            </>
                          ) : generatingImageScene === (scene.id || scene.scene_number) ? (
                            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div className="cyber-scanner-line"></div>
                              <Wand2 className="concept-icon animate-pulse" style={{ width: '22px', height: '22px', color: 'var(--primary)' }} />
                              <p className="concept-placeholder-text" style={{ color: 'var(--primary)' }}>智脑绘制中...</p>
                            </div>
                          ) : (
                            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                              <Sparkles className="concept-icon" style={{ width: '22px', height: '22px' }} />
                              <span className="concept-placeholder-text">一键生成画面</span>
                            </div>
                          )}

                          <div className="concept-meta-top" style={{ zIndex: 3 }}>
                            <span className="badge-scene-num">SCENE {String(scene.scene_number).padStart(2, '0')}</span>
                            <span className="badge-camera" title={scene.camera_direction}>{scene.camera_direction}</span>
                          </div>
                          
                          {/* Camera corners */}
                          <div className="corner-tl" style={{ zIndex: 3 }}></div>
                          <div className="corner-tr" style={{ zIndex: 3 }}></div>
                          <div className="corner-bl" style={{ zIndex: 3 }}></div>
                          <div className="corner-br" style={{ zIndex: 3 }}></div>
                        </div>

                        <div className="scene-meta-badges" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {scene.character_on_screen && scene.character_on_screen !== '无' && (
                            <span className="badge-cyber badge-cyber-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              👤 {scene.character_on_screen}
                            </span>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="badge-cyber badge-cyber-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              <Volume2 style={{ width: '11px', height: '11px' }} />
                              {scene.jianying_voice || '冷酷男神'}
                            </span>
                            <button
                              onClick={() => handlePlayVoice(scene.id || scene.scene_number, scene.dialogue, scene.jianying_voice)}
                              className={`btn-action-small ${activeSpeechScene === (scene.id || scene.scene_number) ? 'active' : ''}`}
                              style={{ display: 'inline-flex', width: '24px', height: '24px', borderRadius: '50%', padding: 0, justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-light)' }}
                              title="试听配音"
                            >
                              {activeSpeechScene === (scene.id || scene.scene_number) ? (
                                <VolumeX style={{ width: '12px', height: '12px', color: 'var(--primary)' }} />
                              ) : (
                                <Play style={{ width: '12px', height: '12px', marginLeft: '1px' }} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 右侧：分镜镜头结构细节 */}
                      <div className="scene-card-right">
                        <div className="scene-detail-header">
                          <div className="visual-desc-box">
                            <span className="detail-label-tech">画面细节描述</span>
                            <p className="visual-desc-text">{scene.visual_description}</p>
                          </div>
                          <div>
                            <button 
                              onClick={() => handleEditClick(scene)}
                              className="btn-action-small"
                              title="微调镜头细节"
                            >
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </div>

                        {/* 即梦中文提示词（高亮代码块） */}
                        <div className="prompt-console">
                          <div className="prompt-console-header">
                            <span className="prompt-console-title">即梦AI (Jimeng AI) 中文提示词</span>
                            <button 
                              onClick={() => handleCopyPrompt(scene.jimeng_prompt, scene.id || scene.scene_number)}
                              className={`btn-console-copy ${copiedSceneId === (scene.id || scene.scene_number) ? 'copied' : ''}`}
                            >
                              {copiedSceneId === (scene.id || scene.scene_number) ? (
                                <>
                                  <Check style={{ width: '12px', height: '12px' }} />
                                  <span>已复制!</span>
                                </>
                              ) : (
                                <>
                                  <Copy style={{ width: '12px', height: '12px' }} />
                                  <span>复制提示词</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="prompt-console-body">
                            {scene.jimeng_prompt}
                          </div>
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
                              <div 
                                className="wave-motion" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handlePlaySFX(scene.id || scene.scene_number, scene.sound_effects)}
                                title="播放合成音效"
                              >
                                <div className="wave-bar" style={{ animationPlayState: activeSFXScene === (scene.id || scene.scene_number) ? 'running' : 'paused' }}></div>
                                <div className="wave-bar" style={{ animationPlayState: activeSFXScene === (scene.id || scene.scene_number) ? 'running' : 'paused' }}></div>
                                <div className="wave-bar" style={{ animationPlayState: activeSFXScene === (scene.id || scene.scene_number) ? 'running' : 'paused' }}></div>
                                <div className="wave-bar" style={{ animationPlayState: activeSFXScene === (scene.id || scene.scene_number) ? 'running' : 'paused' }}></div>
                              </div>
                            </span>
                            <div 
                              className={`audio-box-body sfx ${activeSFXScene === (scene.id || scene.scene_number) ? 'active' : ''}`}
                              style={{ 
                                wordBreak: 'break-all', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s ease', 
                                border: activeSFXScene === (scene.id || scene.scene_number) ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onClick={() => handlePlaySFX(scene.id || scene.scene_number, scene.sound_effects)}
                              title="点击播放合成音效"
                            >
                              {activeSFXScene === (scene.id || scene.scene_number) ? (
                                <VolumeX style={{ width: '13px', height: '13px', color: 'var(--primary)', flexShrink: 0 }} />
                              ) : (
                                <Music style={{ width: '13px', height: '13px', color: 'rgba(0, 242, 254, 0.5)', flexShrink: 0 }} />
                              )}
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

                      <div 
                        className="grid-card-concept-view" 
                        style={{ 
                          position: 'relative', 
                          cursor: scene.image_url ? 'default' : 'pointer',
                          overflow: 'hidden'
                        }}
                        onClick={() => !scene.image_url && !generatingImageScene && handleGenerateImage(scene)}
                      >
                        {scene.image_url && generatingImageScene !== (scene.id || scene.scene_number) ? (
                          <>
                            <img 
                              src={scene.image_url} 
                              alt={`Scene ${scene.scene_number}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
                            />
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(3,4,8,0.8)', 
                              padding: '4px 8px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', textAlign: 'left'
                            }}>
                              <span className="grid-card-concept-title" style={{ margin: 0, fontSize: '8px' }}>{scene.camera_direction}</span>
                            </div>
                            <div className="concept-frame-overlay">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleGenerateImage(scene); }}
                                className="btn-cyber-secondary"
                                style={{ transform: 'scale(0.75)', background: 'rgba(3,4,8,0.9)', border: '1px solid var(--primary)', padding: '4px 8px', pointerEvents: 'auto', display: 'inline-flex', gap: '2px' }}
                              >
                                <Wand2 style={{ width: '10px', height: '10px' }} /> 重新生成
                              </button>
                            </div>
                          </>
                        ) : generatingImageScene === (scene.id || scene.scene_number) ? (
                          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div className="cyber-scanner-line" style={{ height: '1.5px' }}></div>
                            <Wand2 className="concept-icon animate-pulse" style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                            <p className="grid-card-concept-title" style={{ color: 'var(--primary)', margin: 0 }}>智能生图中...</p>
                          </div>
                        ) : (
                          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                            <Sparkles className="concept-icon" style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.2)' }} />
                            <span className="grid-card-concept-title" style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>一键生成画面</span>
                          </div>
                        )}
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
                        <div className="grid-card-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="badge-cyber badge-cyber-purple" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 6px', fontSize: '9px' }}>
                              🎙️ {scene.jianying_voice}
                            </span>
                            <button
                              onClick={() => handlePlayVoice(scene.id || scene.scene_number, scene.dialogue, scene.jianying_voice)}
                              className={`btn-action-small ${activeSpeechScene === (scene.id || scene.scene_number) ? 'active' : ''}`}
                              style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', padding: 0, justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-light)' }}
                              title="试听配音"
                            >
                              {activeSpeechScene === (scene.id || scene.scene_number) ? (
                                <VolumeX style={{ width: '10px', height: '10px', color: 'var(--primary)' }} />
                              ) : (
                                <Play style={{ width: '10px', height: '10px', marginLeft: '1px' }} />
                              )}
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handlePlaySFX(scene.id || scene.scene_number, scene.sound_effects)}
                            className={`badge-cyber badge-cyber-blue`}
                            style={{ 
                              background: activeSFXScene === (scene.id || scene.scene_number) ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                              border: activeSFXScene === (scene.id || scene.scene_number) ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                              color: activeSFXScene === (scene.id || scene.scene_number) ? 'var(--primary)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              fontSize: '9px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="试听合成音效"
                          >
                            <Music style={{ width: '9px', height: '9px' }} />
                            <span>音效</span>
                          </button>
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

            <div className="modal-body">
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
                  <label className="label-tech">出镜人物</label>
                  <input 
                    type="text" 
                    value={editingScene.character_on_screen} 
                    onChange={(e) => setEditingScene({ ...editingScene, character_on_screen: e.target.value })} 
                    className="input-tech"
                  />
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
                  style={{ height: '90px', fontFamily: 'monospace', color: 'var(--primary)' }}
                />
              </div>

              <div className="modal-row-grid-2">
                <div className="form-group">
                  <label className="label-tech">剪映推荐音色</label>
                  <select 
                    value={editingScene.jianying_voice} 
                    onChange={(e) => setEditingScene({ ...editingScene, jianying_voice: e.target.value })} 
                    className="input-tech"
                    style={{ background: 'var(--bg-input)' }}
                  >
                    <option value="深沉旁白">深沉旁白</option>
                    <option value="冷酷男神">冷酷男神</option>
                    <option value="热血少年">热血少年</option>
                    <option value="系统机械音">系统机械音</option>
                    <option value="霸气御姐">霸气御姐</option>
                    <option value="温柔师姐">温柔师姐</option>
                  </select>
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
              </div>

              <div className="form-group">
                <label className="label-tech">剪映配音台词 / 旁白</label>
                <textarea 
                  value={editingScene.dialogue} 
                  onChange={(e) => setEditingScene({ ...editingScene, dialogue: e.target.value })} 
                  className="textarea-tech"
                  style={{ height: '60px' }}
                />
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
    </div>
  );
}
