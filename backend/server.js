const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase, run, all, get } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure public upload directories exist
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const bgmDir = path.join(uploadsDir, 'bgm');
const audioDir = path.join(uploadsDir, 'audio');

[publicDir, uploadsDir, bgmDir, audioDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static assets
app.use('/public', express.static(publicDir));

// 模拟的高燃修仙绑定系统数据，用于无Key演示模式
const SIMULATED_RESPONSE = {
  "characters": [
    {
      "name": "林默",
      "role_type": "主角",
      "appearance_prompt": "一个身穿破旧古代麻衣的18岁少年，黑色头发被暴雨淋湿，满脸泥泞与血水，眼神屈辱而愤怒"
    },
    {
      "name": "叶大少",
      "role_type": "反派",
      "appearance_prompt": "一个身穿华丽白色丝绸古装的傲慢青年男子，手持一把发光的白玉油纸伞"
    },
    {
      "name": "叶大小姐",
      "role_type": "配角",
      "appearance_prompt": "一个面容高傲美丽、身穿华贵红色古代霓裳的年轻女子"
    }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "camera_direction": "特写，俯视镜头缓慢推进",
      "visual_description": "暴雨倾盆，泥泞的地面上，落魄的主角林默伤痕累累，右手手骨已经碎裂变形，被一只穿着奢华白金长靴的脚狠狠踩在泥水里。他眼神屈辱但充满怒火，雨水混着血水顺着脸颊流淌。",
      "character_on_screen": "男主角-林默",
      "jimeng_prompt": "一个身穿破旧古代麻衣的18岁少年，黑色头发被暴雨淋湿，满脸泥泞与血水，眼神屈辱而愤怒，咬紧牙关趴在泥水里。一只穿着极尽奢华的白金刺绣古装长靴的脚，狠狠踩在少年血淋淋的右手手背上。大雨倾盆，地面泥泞不堪，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
      "dialogue": "旁白：林默，一个天生无法觉醒气感的废物。今天，却在未婚妻家族的门前，被人像死狗一样踩在脚下……",
      "sound_effects": "哗啦啦的瓢泼暴雨声，沉重屈辱的低音鼓点，沉闷的心跳声。",
      "jianying_voice": "故事旁白"
    },
    {
      "scene_number": 2,
      "camera_direction": "低角度仰视，傲慢的人物神态",
      "visual_description": "叶家大少爷高傲地站立在暴雨中，手持一把发光的油纸伞，嘴角挂着残忍而轻蔑的冷笑。他身旁站着一位容貌极美但神色极度冷漠、身穿华贵红衣 of 古装女子（未婚妻），正嫌弃地看着林默。",
      "character_on_screen": "反派-叶大少，未婚妻-叶大小姐",
      "jimeng_prompt": "（开启角色参考）一个身穿华丽白色丝绸古装的傲慢青年男子，手持一把发光的白玉油纸伞站在暴雨中，嘴角挂着残忍的冷笑。他身旁站着一个面容高傲美丽、身穿华贵红色古代霓裳的年轻女子，冷眼俯视地面，眼神充满嫌弃与冷漠。雨水被他们身边的淡淡灵力护罩弹开，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
      "dialogue": "叶大少：“林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？真是不自量力！”",
      "sound_effects": "雨水打在灵力光罩上的噼啪声，冷酷嘲讽 of 冷笑声。",
      "jianying_voice": "霸气总裁"
    },
    {
      "scene_number": 3,
      "camera_direction": "特写，神异变幻，极速拉近",
      "visual_description": "泥水中的林默突然狂笑，他的双眼紧闭瞬间睁开，双眸竟变成了耀眼的蓝色神龙瞳孔，眼角散发出丝丝蓝色雷电电流。他的右手臂上，隐约浮现出一层闪烁着蔚蓝色科技电路光芒的古老龙鳞纹路。",
      "character_on_screen": "男主角-林默",
      "jimeng_prompt": "（开启角色参考）趴在泥水中的黑发古代少年突然猛地抬头，他原本漆黑的双眼变成了极其刺眼、散发着蔚蓝色雷电光芒 of 龙之瞳孔。 his 右臂皮肤上浮现出闪烁着蓝色科技电路纹路 of 光彩龙鳞，暴雨在 his 愤怒注视下仿佛在空中静止悬浮，光芒万丈，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
      "dialogue": "系统音：“叮！太古神龙系统绑定成功！检测到宿主声音受到致命威胁，自动启动神龙逆天血脉！”\n林默：“（沙哑冷笑）哈哈哈哈……叶家，你们会后悔的！”",
      "sound_effects": "清脆的电子提示音（叮！），高频能量充电的嗡鸣声，惊心动魄的金属震颤音。",
      "jianying_voice": "系统萌娃"
    },
    {
      "scene_number": 4,
      "camera_direction": "全景，高燃爆发英雄镜头",
      "visual_description": "一股粗壮无比的蓝色神龙光柱从林默身上轰然爆发，直冲云霄。一条由蓝色科技雷电化成的万丈神龙虚影围绕着光柱盘旋怒吼，瞬间将周围的暴雨和叶大少身边的灵力护罩全部震碎，大地颤抖！",
      "character_on_screen": "男主角-林默，神龙虚影",
      "jimeng_prompt": "（开启角色参考）一个黑发少年被一根冲天而起的巨大蓝色科技雷电光柱包倾盘旋，一条万丈巨大的蓝色半透明东方神龙虚影在云雾与雷电中盘旋怒吼。强大的冲击波将周围的大地撕裂，天空的云层被冲散，场面史诗级震撼，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
      "dialogue": "旁白：太古神龙觉醒，仙魔皆要臣服！点击评论区小说链接，看凡骨废物林默，如何踏碎万古天骄！",
      "sound_effects": "震耳欲聋的神龙怒吼声，巨大的能量爆炸声，大气磅礴的燃系国风交响乐高潮，突然黑屏切断。",
      "jianying_voice": "故事旁白"
    }
  ]
};

const SYSTEM_PROMPT = `
你是一个国内顶级的AI漫剧导演和视觉提示词专家，专门服务于抖音/微信视频号上的高燃修仙与古装奇幻漫剧。
你的任务是将用户输入的原始网文片段，重写并拆解为适合【即梦AI (Jimeng AI)】出图的中文分镜脚本，并且提炼出核心角色描述以创建角色一致性档案舱。

你必须输出符合以下要求的 JSON 对象（非数组！），不要返回任何 Markdown 标记或多余的解释文本，只返回符合 JSON 语法的字符串。

输出的 JSON 结构如下：
{
  "characters": [
    {
      "name": "角色名称，如'林默'或'叶大少'",
      "role_type": "角色定位，如'主角'、'反派'、'配角'",
      "appearance_prompt": "中文极其详细的一致性外貌描述，包含性别、发型、面容特征、衣着古装细节等，例如：'一个身穿破旧古代麻衣的18岁少年，黑发，脸庞清秀但布满泥污，眼神屈辱而坚定'"
    }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "camera_direction": "镜头的景别与运动方向，例如：全景，背景雨夜，镜头缓慢向下拉升",
      "visual_description": "中文精细画面描述，包含环境色调、光影、人物表情特征",
      "character_on_screen": "画面中出现的人物名字，必须和上方 characters 定义的名字保持一致，多人可以用中文逗号分隔，如：'男主角-林默' 或 '反派-叶大少，未婚妻-叶大小姐'，若无则填 '无'",
      "jimeng_prompt": "专门给即梦AI(Jimeng AI)的【中文】画面提示词。如果是镜头2及以后，必须在开头加上'(开启角色参考)'字样，并对角色的核心外貌特征进行一致性重述。后缀统一加入画风描述：'，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9'",
      "dialogue": "角色的台词或旁白，需极具爽文情绪张力",
      "sound_effects": "画面的背景音效和背景音乐（BGM）建议，例如：惊雷声，清脆的剑鸣，燃系国风电子乐",
      "jianying_voice": "推荐的剪映专业版免费配音音色，例如：'故事旁白'、'霸气总裁'、'阳光大男孩'、'知性姐姐'、'魅惑御姐'、'东北老铁'、'系统萌娃'"
    }
  ]
}

请确保：
1. 剧本严格保留爽文节奏：前三个镜头必须有强烈的视觉和冲突，抓住观众前3秒注意力。
2. 默认视觉画风锁定为：【唯美写实国风动漫插画风格】。
3. 提示词非常细致，善于描述光影与微小动效，完美适合即梦AI的图生视频。
4. 从剧本内容中准确提炼出所有核心角色，角色名需与 characters 中的 name 相符，提取他们的一致性描述，方便后续一致性生图。
`;

// Helper: 截取小说文字作为标题
function makeTitleFromText(text) {
  const clean = text.replace(/[\r\n\t]/g, ' ').trim();
  if (clean.length <= 15) return clean || "未命名分镜";
  return clean.substring(0, 15) + "...";
}

// 1. 生成分镜接口
app.post('/api/storyboard/generate', async (req, res) => {
  const { novel_text, api_key, api_url, model_name } = req.body;

  if (!novel_text) {
    return res.status(400).json({ error: '小说文本不能为空' });
  }

  let storyboardData = null;

  // 判断是否处于 Demo 模式（即未提供有效的 API Key）
  const isDemo = !api_key || api_key === 'YOUR_API_KEY_HERE' || api_key.trim() === '';

  if (isDemo) {
    // 模拟思考延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    storyboardData = SIMULATED_RESPONSE;
  } else {
    // 调用真正的 API
    const url = api_url || "https://api.deepseek.com/v1/chat/completions";
    const model = model_name || "deepseek-chat";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api_key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `请把以下故事片段改写为爆款修仙漫剧中文分镜脚本，要求节奏紧凑、爽感十足：\n\n${novel_text}` }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API 请求失败，状态码: ${response.status}`);
      }

      const result = await response.json();
      let content = result.choices[0].message.content.trim();
      
      // 容错：去除 LLM 可能返回的 ```json ``` 标记
      if (content.startsWith("```")) {
        content = content.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      storyboardData = JSON.parse(content);
    } catch (err) {
      console.error("调用大模型 API 出错:", err);
      return res.status(500).json({ error: `API 调用失败: ${err.message}. 您可以清空 API Key 使用本地模拟演示模式运行。` });
    }
  }

  // 持久化保存到 SQLite
  try {
    const title = "修仙分镜 - " + makeTitleFromText(novel_text);
    const storyboardInsert = await run(
      `INSERT INTO storyboards (title, novel_text) VALUES (?, ?)`,
      [title, novel_text]
    );
    const storyboardId = storyboardInsert.lastID;

    // 容错解析：可能是新版包含 { characters, scenes }，也可能是旧版数组
    let characters = [];
    let scenes = [];

    if (storyboardData && Array.isArray(storyboardData.scenes)) {
      scenes = storyboardData.scenes;
      characters = Array.isArray(storyboardData.characters) ? storyboardData.characters : [];
    } else if (Array.isArray(storyboardData)) {
      scenes = storyboardData;
      // 兼容旧版：从 scene.character_on_screen 里自动提取独特角色
      const uniqueNames = new Set();
      for (const scene of scenes) {
        if (scene.character_on_screen && scene.character_on_screen !== '无') {
          const names = scene.character_on_screen.split(/[,，]/);
          for (let n of names) {
            n = n.trim();
            if (n && n !== '无') uniqueNames.add(n);
          }
        }
      }
      characters = Array.from(uniqueNames).map(name => {
        let role_type = '配角';
        let cleanName = name;
        if (name.includes('主角') || name.includes('林默') || name.toLowerCase().includes('hero')) {
          role_type = '主角';
        }
        if (name.includes('-')) {
          const parts = name.split('-');
          role_type = parts[0];
          cleanName = parts[1];
        }
        return { name: cleanName, role_type, appearance_prompt: `写实古装风格角色 ${cleanName}` };
      });
    }

    // 批量保存角色演员档案，并映射角色名到数据库 ID
    const charNameToIdMap = {};
    for (const char of characters) {
      const charInsert = await run(
        `INSERT INTO characters (storyboard_id, name, role_type, appearance_prompt) VALUES (?, ?, ?, ?)`,
        [storyboardId, char.name, char.role_type || '主角', char.appearance_prompt || '']
      );
      const insertedId = charInsert.lastID;
      charNameToIdMap[char.name] = insertedId;
      charNameToIdMap[char.role_type + '-' + char.name] = insertedId;
    }

    // 批量保存分镜镜头
    for (const scene of scenes) {
      // 提炼匹配该镜头的角色ID
      const matchedIds = [];
      if (scene.character_on_screen && scene.character_on_screen !== '无') {
        const parts = scene.character_on_screen.split(/[,，]/);
        for (let p of parts) {
          p = p.trim();
          if (charNameToIdMap[p]) {
            matchedIds.push(charNameToIdMap[p]);
          } else {
            // 模糊匹配子串
            for (const [nameKey, cid] of Object.entries(charNameToIdMap)) {
              if (p.includes(nameKey) || nameKey.includes(p)) {
                matchedIds.push(cid);
                break;
              }
            }
          }
        }
      }
      const charIdsStr = matchedIds.filter((v, i, a) => a.indexOf(v) === i).join(',');

      await run(
        `INSERT INTO scenes (storyboard_id, scene_number, camera_direction, visual_description, character_on_screen, jimeng_prompt, dialogue, sound_effects, jianying_voice, image_url, video_url, character_ids)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storyboardId,
          scene.scene_number,
          scene.camera_direction,
          scene.visual_description,
          scene.character_on_screen,
          scene.jimeng_prompt,
          scene.dialogue,
          scene.sound_effects,
          scene.jianying_voice,
          scene.image_url || null,
          scene.video_url || null,
          charIdsStr || null
        ]
      );
    }

    // 从数据库中查询完整存入的数据并返回给前端
    const savedStoryboard = await get(`SELECT * FROM storyboards WHERE id = ?`, [storyboardId]);
    const savedScenes = await all(`SELECT * FROM scenes WHERE storyboard_id = ? ORDER BY scene_number ASC`, [storyboardId]);

    res.json({
      success: true,
      storyboard: savedStoryboard,
      scenes: savedScenes
    });

  } catch (dbErr) {
    console.error("SQLite 写入出错:", dbErr);
    res.status(500).json({ error: '保存数据到数据库失败：' + dbErr.message });
  }
});

// 2. 获取所有历史分镜列表
app.get('/api/storyboard/list', async (req, res) => {
  try {
    const list = await all(`SELECT * FROM storyboards ORDER BY created_at DESC`);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. 获取特定分镜详情（含分镜列表）
app.get('/api/storyboard/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const storyboard = await get(`SELECT * FROM storyboards WHERE id = ?`, [id]);
    if (!storyboard) {
      return res.status(404).json({ error: '未找到该分镜剧本' });
    }
    const scenes = await all(`SELECT * FROM scenes WHERE storyboard_id = ? ORDER BY scene_number ASC`, [id]);
    res.json({ storyboard, scenes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. 更新特定分镜（保存用户的二次微调修改）
app.put('/api/storyboard/:id', async (req, res) => {
  const { id } = req.params;
  const { title, novel_text, scenes, bgm_preset, bgm_custom_url } = req.body;

  try {
    // 动态更新主表
    const updateFields = [];
    const updateParams = [];
    if (title !== undefined) { updateFields.push("title = ?"); updateParams.push(title); }
    if (novel_text !== undefined) { updateFields.push("novel_text = ?"); updateParams.push(novel_text); }
    if (bgm_preset !== undefined) { updateFields.push("bgm_preset = ?"); updateParams.push(bgm_preset); }
    if (bgm_custom_url !== undefined) { updateFields.push("bgm_custom_url = ?"); updateParams.push(bgm_custom_url); }
    
    if (updateFields.length > 0) {
      updateParams.push(id);
      await run(
        `UPDATE storyboards SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }

    // 如果提供了 scenes，则先删除旧分镜，再重新写入
    if (scenes && Array.isArray(scenes)) {
      await run(`DELETE FROM scenes WHERE storyboard_id = ?`, [id]);
      for (const scene of scenes) {
        await run(
          `INSERT INTO scenes (storyboard_id, scene_number, camera_direction, visual_description, character_on_screen, jimeng_prompt, dialogue, sound_effects, jianying_voice, image_url, video_url, character_ids, scenery_id, audio_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            scene.scene_number,
            scene.camera_direction,
            scene.visual_description,
            scene.character_on_screen,
            scene.jimeng_prompt,
            scene.dialogue,
            scene.sound_effects,
            scene.jianying_voice,
            scene.image_url || null,
            scene.video_url || null,
            scene.character_ids || null,
            scene.scenery_id || null,
            scene.audio_url || null
          ]
        );
      }
    }

    res.json({ success: true, message: '保存成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. 删除特定分镜
app.delete('/api/storyboard/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 启用外键联级删除，或者手动删除
    await run(`DELETE FROM scenes WHERE storyboard_id = ?`, [id]);
    await run(`DELETE FROM storyboards WHERE id = ?`, [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. 智能分镜生图接口 (升级版 - 角色与画风一致性注入)
app.post('/api/scene/generate-image', async (req, res) => {
  const { scene_id, prompt, storyboard_id, image_api_key, image_api_url, image_model_name } = req.body;

  if (!scene_id || !prompt) {
    return res.status(400).json({ error: '分镜 ID 和生图提示词不能为空' });
  }

  const isDemo = !image_api_key || image_api_key === 'YOUR_IMAGE_KEY_HERE' || image_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const randomMockUrls = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80"
    ];
    const mockUrl = randomMockUrls[scene_id % randomMockUrls.length];
    try {
      await run(`UPDATE scenes SET image_url = ? WHERE id = ?`, [mockUrl, scene_id]);
      res.json({ success: true, image_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: 'SQLite 数据库写入失败: ' + dbErr.message });
    }
  } else {
    const url = image_api_url || "https://api.siliconflow.cn/v1/images/generations";
    const model = image_model_name || "black-forest-labs/FLUX.1-schnell";

    try {
      // 一致性注入：读取全局画风和角色数据
      let enhancedPrompt = prompt;
      let seed = undefined;

      if (storyboard_id) {
        const storyboard = await get(`SELECT master_seed, style_ref_url, style_preset FROM storyboards WHERE id = ?`, [storyboard_id]);
        if (storyboard) {
          // 画风前缀注入
          if (storyboard.style_preset && storyboard.style_preset !== '国风动漫') {
            enhancedPrompt = `${storyboard.style_preset}风格, ${enhancedPrompt}`;
          }
          // Seed 锁定
          if (storyboard.master_seed && storyboard.master_seed !== -1) {
            const scene = await get(`SELECT scene_number FROM scenes WHERE id = ?`, [scene_id]);
            seed = storyboard.master_seed + (scene ? scene.scene_number : 0);
          }
        }

        // 空间与角色一致性注入：读取分镜关联的场景设定与角色特征并高权重前置注入
        const sceneData = await get(`SELECT character_ids, scenery_id FROM scenes WHERE id = ?`, [scene_id]);
        if (sceneData) {
          // 1. 场景背景环境前置注入
          if (sceneData.scenery_id) {
            const scen = await get(`SELECT name, environment_prompt FROM scenery WHERE id = ?`, [sceneData.scenery_id]);
            if (scen && scen.environment_prompt) {
              enhancedPrompt = `场景环境设定在${scen.name}（背景特征为：${scen.environment_prompt}），` + enhancedPrompt;
            }
          }
          // 2. 出镜角色外貌前置注入
          if (sceneData.character_ids) {
            const charIds = sceneData.character_ids.split(',').map(id => id.trim()).filter(Boolean);
            let charDescriptions = [];
            for (const cid of charIds) {
              const char = await get(`SELECT name, appearance_prompt FROM characters WHERE id = ?`, [cid]);
              if (char && char.appearance_prompt) {
                charDescriptions.push(`出镜人物 ${char.name}（特征为：${char.appearance_prompt}）`);
              }
            }
            if (charDescriptions.length > 0) {
              enhancedPrompt = charDescriptions.join(', ') + ', ' + enhancedPrompt;
            }
          }
        }
      }

      const payload = {
        model: model,
        prompt: enhancedPrompt,
        width: 1024,
        height: 576,
        num_inference_steps: 4,
        batch_size: 1
      };
      if (seed !== undefined) payload.seed = seed;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${image_api_key}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`生图 API 接口响应失败，状态码: ${response.status}`);
      }

      const result = await response.json();
      const imageUrl = result.images?.[0]?.url || result.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error('生图返回中未提取到有效的 URL，请检查接口返回结构');
      }

      await run(`UPDATE scenes SET image_url = ? WHERE id = ?`, [imageUrl, scene_id]);
      res.json({ success: true, image_url: imageUrl });
    } catch (err) {
      console.error("真实生图调用出错:", err);
      res.status(500).json({ error: '生图大模型接口失败: ' + err.message });
    }
  }
});

// 7. 智能分镜生视频接口 (升级版 - 首帧图驱动 I2V + 运镜控制)
app.post('/api/scene/generate-video', async (req, res) => {
  const { scene_id, prompt, image_url, camera_motion, motion_intensity, video_api_key, video_api_url, video_model_name } = req.body;

  if (!scene_id || !prompt) {
    return res.status(400).json({ error: '分镜 ID 和生视频提示词不能为空' });
  }

  const isDemo = !video_api_key || video_api_key === 'YOUR_VIDEO_KEY_HERE' || video_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const randomMockVideos = [
      "https://assets.mixkit.co/videos/preview/mixkit-nebula-of-purple-and-blue-light-43093-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-mysterious-liquid-gold-swirling-background-loop-48633-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-tunnel-with-glowing-neon-lights-50117-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-futuristic-digital-city-loop-50119-large.mp4"
    ];
    const mockUrl = randomMockVideos[scene_id % randomMockVideos.length];
    try {
      await run(`UPDATE scenes SET video_url = ? WHERE id = ?`, [mockUrl, scene_id]);
      res.json({ success: true, video_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: 'SQLite 数据库写入失败: ' + dbErr.message });
    }
  } else {
    const url = video_api_url || "https://api.siliconflow.cn/v1/video/generations";
    const model = video_model_name || "luma/aperture-1.0";

    // 增强运镜描述
    const motionMap = {
      'static': '静态镜头，画面元素微妙动态',
      'pan_left': '平缓向左平移推进',
      'pan_right': '平缓向右平移推进',
      'zoom_in': '缓慢推进特写',
      'zoom_out': '缓慢拉远全景',
      'tilt_up': '镜头从下往上缓慢抬升',
      'tilt_down': '镜头从上往下缓慢俯冲',
      'orbit': '环绕人物360度缓慢旋转',
      'dolly_in': '快速推进冲击感镜头',
      'crane_up': '升降机镜头从低到高',
    };
    const motionDesc = motionMap[camera_motion] || motionMap['static'];
    const intensity = motion_intensity || 'low';
    const enhancedPrompt = `${prompt}, cinematic ${motionDesc}, motion intensity: ${intensity}, smooth camera movement, professional cinematography`;

    try {
      const payload = {
        model: model,
        prompt: enhancedPrompt,
        image: image_url || undefined,
        stream: false
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${video_api_key}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`生视频 API 接口响应失败，状态码: ${response.status}`);
      }

      const result = await response.json();
      const videoUrl = result.video_url || result.url || result.images?.[0]?.url || result.data?.[0]?.url || (result.task && result.task.id);

      if (!videoUrl) {
        throw new Error('生视频返回中未提取到有效的 URL 或任务 ID');
      }

      await run(`UPDATE scenes SET video_url = ? WHERE id = ?`, [videoUrl, scene_id]);
      res.json({ success: true, video_url: videoUrl });
    } catch (err) {
      console.error("真实生视频调用出错:", err);
      res.status(500).json({ error: '生视频大模型接口失败: ' + err.message });
    }
  }
});

// 8. 智能分镜语音大模型合成接口 (New Text-to-Speech Feature with persistent saving)
app.post('/api/scene/generate-tts', async (req, res) => {
  const { voice_name, text, scene_id, tts_api_key, tts_api_url, tts_model_name } = req.body;

  if (!text) {
    return res.status(400).json({ error: '合成台词不能为空' });
  }

  const isDemo = !tts_api_key || tts_api_key === 'YOUR_TTS_KEY_HERE' || tts_api_key.trim() === '';

  // 1-second silent MP3 base64 placeholder for Demo Mode
  const SILENT_MP3_BASE64 = "SUQzBAAAAAAAAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXAzdgBUWFhYAAAAEgAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAG1wM3Zpc29tAFRFTkMAAAAQAAADTGF2Zi11dGlscwBlbWJUAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAA";

  if (isDemo) {
    let publicUrl = null;
    if (scene_id) {
      try {
        const filename = `scene_${scene_id}.mp3`;
        const filePath = path.join(audioDir, filename);
        fs.writeFileSync(filePath, Buffer.from(SILENT_MP3_BASE64, 'base64'));
        publicUrl = `/public/uploads/audio/${filename}`;
        await run(`UPDATE scenes SET audio_url = ? WHERE id = ?`, [publicUrl, scene_id]);
      } catch (err) {
        console.error("Demo 模式下保存音频失败:", err);
      }
    }
    return res.json({ 
      success: true, 
      mode: 'local', 
      audio_base64: SILENT_MP3_BASE64,
      audio_url: publicUrl,
      message: '未配置大模型KEY，将自动降级使用浏览器原生的分发语音播放' 
    });
  }

  // 映射大模型配音角色音色
  const model = tts_model_name || "FunAudioLLM/CosyVoice2-0.5B";
  const isCosyVoice = model.toLowerCase().includes('cosyvoice');
  
  let selectedVoice = 'FunAudioLLM/CosyVoice2-0.5B:alex';
  if (isCosyVoice) {
    const cosyMap = {
      '故事旁白': 'FunAudioLLM/CosyVoice2-0.5B:alex',
      '霸气总裁': 'FunAudioLLM/CosyVoice2-0.5B:tony',
      '阳光大男孩': 'FunAudioLLM/CosyVoice2-0.5B:brian',
      '知性姐姐': 'FunAudioLLM/CosyVoice2-0.5B:bella',
      '魅惑御姐': 'FunAudioLLM/CosyVoice2-0.5B:dilys',
      '东北老铁': 'FunAudioLLM/CosyVoice2-0.5B:tony',
      '系统萌娃': 'FunAudioLLM/CosyVoice2-0.5B:cherry'
    };
    selectedVoice = cosyMap[voice_name] || 'FunAudioLLM/CosyVoice2-0.5B:alex';
  } else {
    // 兼容 OpenAI TTS 声音名
    const openAiMap = {
      '故事旁白': 'onyx',
      '霸气总裁': 'onyx',
      '阳光大男孩': 'alloy',
      '知性姐姐': 'nova',
      '魅惑御姐': 'shimmer',
      '东北老铁': 'fable',
      '系统萌娃': 'echo'
    };
    selectedVoice = openAiMap[voice_name] || 'alloy';
  }

  const url = tts_api_url || "https://api.siliconflow.cn/v1/audio/speech";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tts_api_key}`
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: selectedVoice,
        response_format: "mp3",
        speed: 1.0,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`语音 API 响应失败，状态码: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);
    const base64 = nodeBuffer.toString('base64');
    
    let publicUrl = null;
    if (scene_id) {
      const filename = `scene_${scene_id}.mp3`;
      const filePath = path.join(audioDir, filename);
      fs.writeFileSync(filePath, nodeBuffer);
      publicUrl = `/public/uploads/audio/${filename}`;
      await run(`UPDATE scenes SET audio_url = ? WHERE id = ?`, [publicUrl, scene_id]);
    }

    res.json({ 
      success: true, 
      mode: 'online', 
      audio_base64: base64,
      audio_url: publicUrl
    });
  } catch (err) {
    console.error("真实语音合成调用出错:", err);
    res.status(500).json({ error: '语音大模型生成失败: ' + err.message });
  }
});

// 8.1 自定义全局 BGM 上传接口
app.post('/api/storyboard/:id/upload-bgm', async (req, res) => {
  const { id } = req.params;
  const { audio_base64, filename } = req.body;

  if (!audio_base64) {
    return res.status(400).json({ error: '音频 base64 内容不能为空' });
  }

  try {
    const ext = path.extname(filename || 'bgm.mp3') || '.mp3';
    const cleanFilename = `bgm_${id}_${Date.now()}${ext}`;
    const filePath = path.join(bgmDir, cleanFilename);
    
    // Save buffer
    const buffer = Buffer.from(audio_base64, 'base64');
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/public/uploads/bgm/${cleanFilename}`;
    
    // Update storyboard
    await run(`UPDATE storyboards SET bgm_custom_url = ?, bgm_preset = NULL WHERE id = ?`, [publicUrl, id]);

    res.json({ success: true, bgm_custom_url: publicUrl });
  } catch (err) {
    console.error("上传 BGM 出错:", err);
    res.status(500).json({ error: err.message });
  }
});

// 8.2 一键导出剪映草稿工程接口
app.post('/api/storyboard/:id/export-jianying', async (req, res) => {
  const { id } = req.params;
  try {
    const storyboard = await get(`SELECT * FROM storyboards WHERE id = ?`, [id]);
    if (!storyboard) {
      return res.status(404).json({ error: '未找到该分镜剧本' });
    }
    const scenes = await all(`SELECT * FROM scenes WHERE storyboard_id = ? ORDER BY scene_number ASC`, [id]);
    if (!scenes || scenes.length === 0) {
      return res.status(400).json({ error: '该分镜剧本没有任何镜头，无法导出' });
    }

    const AdmZip = require('adm-zip');
    const zip = new AdmZip();
    
    // Create draft folder structures
    const draftFolder = `AI_Comic_Storyboard_${id}`;
    const assetsFolder = `${draftFolder}/assets`;
    
    const videoMaterials = [];
    const audioMaterials = [];
    const textMaterials = [];
    
    const videoSegments = [];
    const audioSegments = [];
    const textSegments = [];
    
    let cumulativeTime = 0;
    
    // Download helper for ZIP writing
    const downloadToZip = async (url, zipPath) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          zip.addFile(zipPath, Buffer.from(buffer));
          return true;
        }
      } catch (err) {
        console.error(`Failed to download ${url} to zip ${zipPath}:`, err);
      }
      return false;
    };
    
    // 1-second silent MP3 buffer to use as placeholder
    const SILENT_MP3_BASE64 = "SUQzBAAAAAAAAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXAzdgBUWFhYAAAAEgAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAG1wM3Zpc29tAFRFTkMAAAAQAAADTGF2Zi11dGlscwBlbWJUAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAAAD/AAAAA";
    const silentBuffer = Buffer.from(SILENT_MP3_BASE64, 'base64');

    // Default placeholder image (1x1 pixel grey png)
    const GRAY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const grayBuffer = Buffer.from(GRAY_PNG_BASE64, 'base64');

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      // Calculate scene duration (microseconds)
      const dialogueText = scene.dialogue || '';
      let sceneDuration = Math.max(3000000, dialogueText.length * 250000 + 800000);
      if (!dialogueText.trim()) {
        sceneDuration = 4000000; // 4 seconds default
      }
      
      // 1. Process Visual (Video or Image)
      let hasVideo = !!scene.video_url;
      let visualUrl = scene.video_url || scene.image_url;
      const visualExt = hasVideo ? '.mp4' : '.png';
      const visualFilename = `scene_${scene.scene_number}${visualExt}`;
      const visualZipPath = `${assetsFolder}/${visualFilename}`;
      
      let visualLoaded = false;
      if (visualUrl) {
        if (visualUrl.startsWith('/public/')) {
          const localPath = path.join(__dirname, visualUrl);
          if (fs.existsSync(localPath)) {
            zip.addFile(visualZipPath, fs.readFileSync(localPath));
            visualLoaded = true;
          }
        } else if (visualUrl.startsWith('http')) {
          visualLoaded = await downloadToZip(visualUrl, visualZipPath);
        }
      }
      
      // Fallback visual if loading fails
      if (!visualLoaded) {
        zip.addFile(visualZipPath, grayBuffer);
      }
      
      // 2. Process Dialogue Audio
      const audioFilename = `audio_${scene.scene_number}.mp3`;
      const audioZipPath = `${assetsFolder}/${audioFilename}`;
      let audioLoaded = false;
      
      if (scene.audio_url) {
        if (scene.audio_url.startsWith('/public/')) {
          const localPath = path.join(__dirname, scene.audio_url);
          if (fs.existsSync(localPath)) {
            zip.addFile(audioZipPath, fs.readFileSync(localPath));
            audioLoaded = true;
          }
        } else if (scene.audio_url.startsWith('http')) {
          audioLoaded = await downloadToZip(scene.audio_url, audioZipPath);
        }
      }
      
      // Fallback silent audio if missing
      if (!audioLoaded) {
        zip.addFile(audioZipPath, silentBuffer);
      }
      
      // 3. Materials data maps
      videoMaterials.push({
        "category_id": "",
        "category_name": "",
        "duration": sceneDuration,
        "extra_info": "",
        "file_EndTime": 0,
        "file_StartTime": 0,
        "height": 1080,
        "id": `material_video_${scene.id}`,
        "import_time": Math.floor(Date.now() / 1000),
        "import_time_ms": Date.now(),
        "item_source": 1,
        "local_id": "",
        "local_material_id": "",
        "material_name": visualFilename,
        "material_status": 0,
        "path": `assets/${visualFilename}`,
        "type": hasVideo ? "video" : "photo",
        "width": 1920
      });
      
      audioMaterials.push({
        "category_id": "",
        "category_name": "",
        "duration": sceneDuration,
        "extra_info": "",
        "file_EndTime": 0,
        "file_StartTime": 0,
        "id": `material_audio_${scene.id}`,
        "import_time": Math.floor(Date.now() / 1000),
        "import_time_ms": Date.now(),
        "item_source": 1,
        "local_id": "",
        "local_material_id": "",
        "material_name": audioFilename,
        "material_status": 0,
        "path": `assets/${audioFilename}`,
        "type": "music"
      });
      
      // CapCut Text Subtitle Material (uses double-escaped styles text JSON string)
      textMaterials.push({
        "align_type": 1,
        "background_alpha": 1.0,
        "background_color": "",
        "background_height": 1.0,
        "background_round_radius": 0.0,
        "background_style": 0,
        "background_width": 1.0,
        "bold_width": 0.0,
        "border_alpha": 1.0,
        "border_color": "",
        "border_width": 0.08,
        "font_category_id": "",
        "font_category_name": "",
        "font_id": "",
        "font_name": "",
        "font_path": "",
        "font_resource_id": "",
        "font_size": 15.0,
        "font_title": "System",
        "force_apply_line_max_width": false,
        "gloomy_alpha": 1.0,
        "gloomy_color": "",
        "gloomy_intensity": 0.12,
        "has_shadow": true,
        "id": `material_text_${scene.id}`,
        "italic_degree": 0,
        "line_gap": 15.0,
        "shadow_alpha": 0.8,
        "shadow_angle": -45.0,
        "shadow_color": "#000000",
        "shadow_distance": 8.0,
        "shadow_point": {
          "x": 1.0,
          "y": -1.0
        },
        "shadow_smoothing": 1.0,
        "typesetting": 0,
        "underline_offset": 0.15,
        "value": JSON.stringify({ styles: [], text: dialogueText })
      });
      
      // 4. Track Segments
      videoSegments.push({
        "cartoon_color_face_id": "",
        "cartoon_color_face_path": "",
        "cartoon_color_face_title": "",
        "clip_settings": {
          "alpha": 1.0,
          "flip": { "horizontal": false, "vertical": false },
          "rotation": 0.0,
          "scale": { "x": 1.0, "y": 1.0 },
          "transform": { "x": 0.0, "y": 0.0 }
        },
        "common_keyframes": [],
        "enable_adjust": true,
        "enable_color_curves": true,
        "enable_color_wheels": true,
        "enable_lut": true,
        "enable_smart_color_adjust": false,
        "extra_material_refs": [],
        "id": `segment_video_${scene.id}`,
        "intensities_keyframes": [],
        "is_placeholder": false,
        "keyframe_refs": [],
        "material_id": `material_video_${scene.id}`,
        "render_index": 0,
        "responsive_layout": { "enable": false, "horizontal_pos_type": 0, "horizontal_pos_value": 0.0, "size_type": 0, "size_value": 0.0, "vertical_pos_type": 0, "vertical_pos_value": 0.0 },
        "reverse": false,
        "source_timerange": { "duration": sceneDuration, "start": 0 },
        "speed_control_id": "speed_normal",
        "target_timerange": { "duration": sceneDuration, "start": cumulativeTime },
        "track_attribute_flags": 0,
        "track_id": "track_video_primary",
        "volume": 1.0
      });
      
      audioSegments.push({
        "cartoon_color_face_id": "",
        "cartoon_color_face_path": "",
        "cartoon_color_face_title": "",
        "common_keyframes": [],
        "enable_adjust": true,
        "extra_material_refs": [],
        "id": `segment_audio_${scene.id}`,
        "intensities_keyframes": [],
        "is_placeholder": false,
        "keyframe_refs": [],
        "material_id": `material_audio_${scene.id}`,
        "render_index": 0,
        "reverse": false,
        "source_timerange": { "duration": sceneDuration, "start": 0 },
        "speed_control_id": "speed_normal",
        "target_timerange": { "duration": sceneDuration, "start": cumulativeTime },
        "track_attribute_flags": 0,
        "track_id": "track_audio_dialogue",
        "volume": 1.0
      });
      
      textSegments.push({
        "cartoon_color_face_id": "",
        "cartoon_color_face_path": "",
        "cartoon_color_face_title": "",
        "common_keyframes": [],
        "enable_adjust": true,
        "extra_material_refs": [],
        "id": `segment_text_${scene.id}`,
        "intensities_keyframes": [],
        "is_placeholder": false,
        "keyframe_refs": [],
        "material_id": `material_text_${scene.id}`,
        "render_index": 0,
        "reverse": false,
        "source_timerange": null,
        "target_timerange": { "duration": sceneDuration, "start": cumulativeTime },
        "track_attribute_flags": 0,
        "track_id": "track_text_subtitle"
      });
      
      cumulativeTime += sceneDuration;
    }
    
    // 5. Process BGM if present
    const bgmUrl = storyboard.bgm_custom_url || (storyboard.bgm_preset ? `/public/uploads/bgm/preset_${storyboard.bgm_preset}.mp3` : null);
    let bgmLoaded = false;
    
    if (bgmUrl) {
      const bgmZipPath = `${assetsFolder}/bgm.mp3`;
      if (bgmUrl.startsWith('/public/')) {
        const localPath = path.join(__dirname, bgmUrl);
        if (fs.existsSync(localPath)) {
          zip.addFile(bgmZipPath, fs.readFileSync(localPath));
          bgmLoaded = true;
        }
      } else if (bgmUrl.startsWith('http')) {
        bgmLoaded = await downloadToZip(bgmUrl, bgmZipPath);
      }
    }
    
    if (bgmLoaded) {
      audioMaterials.push({
        "category_id": "",
        "category_name": "",
        "duration": cumulativeTime,
        "extra_info": "",
        "file_EndTime": 0,
        "file_StartTime": 0,
        "id": "material_bgm",
        "import_time": Math.floor(Date.now() / 1000),
        "import_time_ms": Date.now(),
        "item_source": 1,
        "local_id": "",
        "local_material_id": "",
        "material_name": "bgm.mp3",
        "material_status": 0,
        "path": "assets/bgm.mp3",
        "type": "music"
      });
    }

    // 6. Build tracks array
    const tracks = [
      {
        "attribute_flags": 0,
        "id": "track_video_primary",
        "type": "video",
        "segments": videoSegments
      },
      {
        "attribute_flags": 0,
        "id": "track_audio_dialogue",
        "type": "audio",
        "segments": audioSegments
      },
      {
        "attribute_flags": 0,
        "id": "track_text_subtitle",
        "type": "text",
        "segments": textSegments
      }
    ];
    
    if (bgmLoaded) {
      tracks.push({
        "attribute_flags": 0,
        "id": "track_audio_bgm",
        "type": "audio",
        "segments": [
          {
            "cartoon_color_face_id": "",
            "cartoon_color_face_path": "",
            "cartoon_color_face_title": "",
            "common_keyframes": [],
            "enable_adjust": true,
            "extra_material_refs": [],
            "id": "segment_bgm",
            "intensities_keyframes": [],
            "is_placeholder": false,
            "keyframe_refs": [],
            "material_id": "material_bgm",
            "render_index": 0,
            "reverse": false,
            "source_timerange": { "duration": cumulativeTime, "start": 0 },
            "speed_control_id": "speed_normal",
            "target_timerange": { "duration": cumulativeTime, "start": 0 },
            "volume": 0.3,
            "track_attribute_flags": 0,
            "track_id": "track_audio_bgm"
          }
        ]
      });
    }
    
    // 7. Compose draft_content.json
    const draftContent = {
      "canvas_config": {
        "height": 1080,
        "ratio": "16:9",
        "width": 1920
      },
      "color_space": 0,
      "config": {
        "adjust_max_duration_limit": true,
        "alignment_distance": 2000,
        "apple_color_space": 0,
        "attachment_info": [],
        "background_activity_enabled": true,
        "color_space": 0,
        "time_mode": "millisecond"
      },
      "duration": cumulativeTime,
      "materials": {
        "speeds": [
          {
            "id": "speed_normal",
            "speed": 1.0,
            "type": "speed"
          }
        ],
        "canvases": [],
        "videos": videoMaterials,
        "audios": audioMaterials,
        "texts": textMaterials
      },
      "tracks": tracks
    };
    
    // 8. Compose draft_meta_info.json
    const draftMetaInfo = {
      "draft_id": `AI_Comic_Storyboard_${id}`,
      "draft_name": storyboard.title,
      "draft_type": "video",
      "duration": cumulativeTime,
      "fps": 30.0,
      "height": 1080,
      "width": 1920,
      "tm_draft_modified": Date.now() * 1000
    };
    
    zip.addFile(`${draftFolder}/draft_content.json`, Buffer.from(JSON.stringify(draftContent, null, 2)));
    zip.addFile(`${draftFolder}/draft_meta_info.json`, Buffer.from(JSON.stringify(draftMetaInfo, null, 2)));
    
    // 9. Write ZIP to static upload folder and return
    const zipFilename = `Storyboard_${id}_JianyingDraft.zip`;
    const zipFilePath = path.join(uploadsDir, zipFilename);
    zip.writeZip(zipFilePath);
    
    const downloadUrl = `/public/uploads/${zipFilename}`;
    res.json({ success: true, download_url: downloadUrl, size: fs.statSync(zipFilePath).size });
  } catch (err) {
    console.error("生成剪映草稿包失败:", err);
    res.status(500).json({ error: '剪映草稿包导出失败: ' + err.message });
  }
});

// 9. 测试 LLM 大模型连通性
app.post('/api/test/llm', async (req, res) => {
  const { api_key, api_url, model_name } = req.body;
  if (!api_key) return res.json({ success: false, error: '未提供 API Key' });

  const startTime = Date.now();
  const url = api_url || "https://api.deepseek.com/v1/chat/completions";
  const model = model_name || "deepseek-chat";

  // 将接口端点后缀替换为 /models，在不触发真实模型调用的情况下，同时验证网关可用性、API Key 有效性与模型型号存在性
  let modelsUrl = url;
  if (url.endsWith('/chat/completions') || url.endsWith('/images/generations') || url.endsWith('/video/generations') || url.endsWith('/audio/speech')) {
    modelsUrl = url.replace(/\/chat\/completions$|\/images\/generations$|\/video\/generations$|\/audio\/speech$/, '/models');
  } else {
    modelsUrl = url.endsWith('/') ? `${url}models` : `${url}/models`;
  }

  try {
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${api_key}`
      }
    });

    const latency = Date.now() - startTime;
    if (response.status === 401) {
      return res.json({ success: false, error: 'API Key 无效 (401)' });
    }
    if (response.status === 403) {
      return res.json({ success: false, error: '无权限访问该模型 (403)' });
    }
    if (response.status === 404) {
      return res.json({ success: false, error: `接口网关错误或未找到 (404)。探测地址: ${modelsUrl}` });
    }
    if (response.status === 429) {
      return res.json({ success: false, error: '接口请求过于频繁或额度已耗尽 (429)' });
    }
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `连接失败 (状态码: ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errMsg = parsed.error.message;
        }
      } catch (e) {}
      return res.json({ success: false, error: errMsg });
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      const modelExists = result.data.some(m => m.id === model);
      if (!modelExists) {
        const sampleModels = result.data.slice(0, 5).map(m => m.id).join(', ');
        return res.json({ 
          success: false, 
          error: `模型型号 "${model}" 不存在。网关可用，可用模型示例: ${sampleModels}...` 
        });
      }
    }

    res.json({ success: true, latency });
  } catch (err) {
    res.json({ success: false, error: '网络连接失败，请检查 API 网关: ' + err.message });
  }
});

// 9.1 测试生图 T2I 连通性
app.post('/api/test/image', async (req, res) => {
  const { api_key, api_url, model_name } = req.body;
  if (!api_key) return res.json({ success: false, error: '未提供 API Key' });

  const startTime = Date.now();
  const url = api_url || "https://api.siliconflow.cn/v1/images/generations";
  const model = model_name || "black-forest-labs/FLUX.1-schnell";

  let modelsUrl = url;
  if (url.endsWith('/chat/completions') || url.endsWith('/images/generations') || url.endsWith('/video/generations') || url.endsWith('/audio/speech')) {
    modelsUrl = url.replace(/\/chat\/completions$|\/images\/generations$|\/video\/generations$|\/audio\/speech$/, '/models');
  } else {
    modelsUrl = url.endsWith('/') ? `${url}models` : `${url}/models`;
  }

  try {
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${api_key}`
      }
    });

    const latency = Date.now() - startTime;
    if (response.status === 401) {
      return res.json({ success: false, error: 'API Key 无效 (401)' });
    }
    if (response.status === 403) {
      return res.json({ success: false, error: '无权限访问该模型 (403)' });
    }
    if (response.status === 404) {
      return res.json({ success: false, error: `接口网关错误或未找到 (404)。探测地址: ${modelsUrl}` });
    }
    if (response.status === 429) {
      return res.json({ success: false, error: '接口请求过于频繁或额度已耗尽 (429)' });
    }
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `连接失败 (状态码: ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errMsg = parsed.error.message;
        }
      } catch (e) {}
      return res.json({ success: false, error: errMsg });
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      const modelExists = result.data.some(m => m.id === model);
      if (!modelExists) {
        const sampleModels = result.data.slice(0, 5).map(m => m.id).join(', ');
        return res.json({ 
          success: false, 
          error: `模型型号 "${model}" 不存在。网关可用，可用模型示例: ${sampleModels}...` 
        });
      }
    }

    res.json({ success: true, latency });
  } catch (err) {
    res.json({ success: false, error: '网络连接失败，请检查 API 网关: ' + err.message });
  }
});

// 9.2 测试生视频 T2V 连通性
app.post('/api/test/video', async (req, res) => {
  const { api_key, api_url, model_name } = req.body;
  if (!api_key) return res.json({ success: false, error: '未提供 API Key' });

  const startTime = Date.now();
  const url = api_url || "https://api.siliconflow.cn/v1/video/generations";
  const model = model_name || "luma/aperture-1.0";

  let modelsUrl = url;
  if (url.endsWith('/chat/completions') || url.endsWith('/images/generations') || url.endsWith('/video/generations') || url.endsWith('/audio/speech')) {
    modelsUrl = url.replace(/\/chat\/completions$|\/images\/generations$|\/video\/generations$|\/audio\/speech$/, '/models');
  } else {
    modelsUrl = url.endsWith('/') ? `${url}models` : `${url}/models`;
  }

  try {
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${api_key}`
      }
    });

    const latency = Date.now() - startTime;
    if (response.status === 401) {
      return res.json({ success: false, error: 'API Key 无效 (401)' });
    }
    if (response.status === 403) {
      return res.json({ success: false, error: '无权限访问该模型 (403)' });
    }
    if (response.status === 404) {
      return res.json({ success: false, error: `接口网关错误或未找到 (404)。探测地址: ${modelsUrl}` });
    }
    if (response.status === 429) {
      return res.json({ success: false, error: '接口请求过于频繁或额度已耗尽 (429)' });
    }
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `连接失败 (状态码: ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errMsg = parsed.error.message;
        }
      } catch (e) {}
      return res.json({ success: false, error: errMsg });
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      const modelExists = result.data.some(m => m.id === model);
      if (!modelExists) {
        const sampleModels = result.data.slice(0, 5).map(m => m.id).join(', ');
        return res.json({ 
          success: false, 
          error: `模型型号 "${model}" 不存在。网关可用，可用模型示例: ${sampleModels}...` 
        });
      }
    }

    res.json({ success: true, latency });
  } catch (err) {
    res.json({ success: false, error: '网络连接失败，请检查 API 网关: ' + err.message });
  }
});

// 10. 测试语音大模型连通性
app.post('/api/test/tts', async (req, res) => {
  const { api_key, api_url, model_name } = req.body;
  if (!api_key) return res.json({ success: false, error: '未提供 API Key' });

  const startTime = Date.now();
  const url = api_url || "https://api.siliconflow.cn/v1/audio/speech";
  const model = model_name || "FunAudioLLM/CosyVoice2-0.5B";

  let modelsUrl = url;
  if (url.endsWith('/chat/completions') || url.endsWith('/images/generations') || url.endsWith('/video/generations') || url.endsWith('/audio/speech')) {
    modelsUrl = url.replace(/\/chat\/completions$|\/images\/generations$|\/video\/generations$|\/audio\/speech$/, '/models');
  } else {
    modelsUrl = url.endsWith('/') ? `${url}models` : `${url}/models`;
  }

  try {
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${api_key}`
      }
    });

    const latency = Date.now() - startTime;
    if (response.status === 401) {
      return res.json({ success: false, error: 'API Key 无效 (401)' });
    }
    if (response.status === 403) {
      return res.json({ success: false, error: '无权限访问该模型 (403)' });
    }
    if (response.status === 404) {
      return res.json({ success: false, error: `接口网关错误或未找到 (404)。探测地址: ${modelsUrl}` });
    }
    if (response.status === 429) {
      return res.json({ success: false, error: '接口请求过于频繁或额度已耗尽 (429)' });
    }
    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `连接失败 (状态码: ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errMsg = parsed.error.message;
        }
      } catch (e) {}
      return res.json({ success: false, error: errMsg });
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      const modelExists = result.data.some(m => m.id === model);
      if (!modelExists) {
        const sampleModels = result.data.slice(0, 5).map(m => m.id).join(', ');
        return res.json({ 
          success: false, 
          error: `模型型号 "${model}" 不存在。网关可用，可用模型示例: ${sampleModels}...` 
        });
      }
    }

    res.json({ success: true, latency });
  } catch (err) {
    res.json({ success: false, error: '网络连接失败，请检查 API 网关: ' + err.message });
  }
});

// 10.1 空间场景设定舱 CRUD (Scenery/Scene Cabin CRUD)
app.post('/api/scenery', async (req, res) => {
  const { storyboard_id, name, environment_prompt } = req.body;
  if (!storyboard_id || !name) return res.status(400).json({ error: '分镜板ID和场景名不能为空' });
  try {
    const result = await run(
      `INSERT INTO scenery (storyboard_id, name, environment_prompt) VALUES (?, ?, ?)`,
      [storyboard_id, name, environment_prompt || '']
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scenery/:storyboard_id', async (req, res) => {
  try {
    const scenes = await all(`SELECT * FROM scenery WHERE storyboard_id = ? ORDER BY id`, [req.params.storyboard_id]);
    res.json(scenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scenery/:id', async (req, res) => {
  const { name, image_url, environment_prompt } = req.body;
  try {
    await run(
      `UPDATE scenery SET name = COALESCE(?, name), image_url = COALESCE(?, image_url), environment_prompt = COALESCE(?, environment_prompt) WHERE id = ?`,
      [name, image_url, environment_prompt, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/scenery/:id', async (req, res) => {
  try {
    await run(`DELETE FROM scenery WHERE id = ?`, [req.params.id]);
    // 同时把绑在该场景的分镜场景ID重置为 NULL
    await run(`UPDATE scenes SET scenery_id = NULL WHERE scenery_id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10.2 一键渲染空间场景原画 (Generate Scenery Image)
app.post('/api/scenery/:id/generate-image', async (req, res) => {
  const { environment_prompt, image_api_key, image_api_url, image_model_name } = req.body;
  const sceneId = req.params.id;

  if (!environment_prompt) return res.status(400).json({ error: '空间环境特征描述不能为空' });

  const isDemo = !image_api_key || image_api_key === 'YOUR_IMAGE_KEY_HERE' || image_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockScenery = [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80"
    ];
    const mockUrl = mockScenery[sceneId % mockScenery.length];
    try {
      await run(`UPDATE scenery SET image_url = ? WHERE id = ?`, [mockUrl, sceneId]);
      res.json({ success: true, image_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: dbErr.message });
    }
  } else {
    const url = image_api_url || "https://api.siliconflow.cn/v1/images/generations";
    const model = image_model_name || "black-forest-labs/FLUX.1-schnell";
    const fullPrompt = `scenery concept art, establishing shot, environment background: ${environment_prompt}, detailed anime style, highly detailed, 8k --ar 16:9`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${image_api_key}` },
        body: JSON.stringify({ model, prompt: fullPrompt, width: 1024, height: 576, num_inference_steps: 4, batch_size: 1 })
      });
      if (!response.ok) throw new Error(`空间场景原画 API 响应失败: ${response.status}`);
      const result = await response.json();
      const imageUrl = result.images?.[0]?.url || result.data?.[0]?.url;
      if (!imageUrl) throw new Error('原画返回中未提取到有效 URL');
      await run(`UPDATE scenery SET image_url = ? WHERE id = ?`, [imageUrl, sceneId]);
      res.json({ success: true, image_url: imageUrl });
    } catch (err) {
      console.error("空间场景原画渲染失败:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

// 11. 角色演员档案 CRUD (Character Profile Management)
app.post('/api/characters', async (req, res) => {
  const { storyboard_id, name, role_type, appearance_prompt } = req.body;
  if (!storyboard_id || !name) return res.status(400).json({ error: '分镜板ID和角色名不能为空' });
  try {
    const result = await run(
      `INSERT INTO characters (storyboard_id, name, role_type, appearance_prompt) VALUES (?, ?, ?, ?)`,
      [storyboard_id, name, role_type || '主角', appearance_prompt || '']
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/characters/:storyboard_id', async (req, res) => {
  try {
    const chars = await all(`SELECT * FROM characters WHERE storyboard_id = ? ORDER BY id`, [req.params.storyboard_id]);
    res.json(chars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/characters/:id', async (req, res) => {
  const { name, role_type, avatar_url, turnaround_url, pose_url, voice_name, appearance_prompt } = req.body;
  try {
    await run(
      `UPDATE characters SET name = COALESCE(?, name), role_type = COALESCE(?, role_type), avatar_url = COALESCE(?, avatar_url), turnaround_url = COALESCE(?, turnaround_url), pose_url = COALESCE(?, pose_url), voice_name = COALESCE(?, voice_name), appearance_prompt = COALESCE(?, appearance_prompt) WHERE id = ?`,
      [name, role_type, avatar_url, turnaround_url, pose_url, voice_name, appearance_prompt, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/characters/:id', async (req, res) => {
  try {
    await run(`DELETE FROM characters WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. 一键渲染角色定妆照 (Generate Character Avatar)
app.post('/api/characters/:id/generate-avatar', async (req, res) => {
  const { appearance_prompt, image_api_key, image_api_url, image_model_name } = req.body;
  const charId = req.params.id;

  if (!appearance_prompt) return res.status(400).json({ error: '角色外貌特征描述不能为空' });

  const isDemo = !image_api_key || image_api_key === 'YOUR_IMAGE_KEY_HERE' || image_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockAvatars = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=512&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=512&q=80"
    ];
    const mockUrl = mockAvatars[charId % mockAvatars.length];
    try {
      await run(`UPDATE characters SET avatar_url = ? WHERE id = ?`, [mockUrl, charId]);
      res.json({ success: true, avatar_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: dbErr.message });
    }
  } else {
    const url = image_api_url || "https://api.siliconflow.cn/v1/images/generations";
    const model = image_model_name || "black-forest-labs/FLUX.1-schnell";
    const fullPrompt = `portrait photo, character reference sheet, ${appearance_prompt}, single character, white background, high quality, detailed face, consistent appearance, 8k --ar 1:1`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${image_api_key}` },
        body: JSON.stringify({ model, prompt: fullPrompt, width: 512, height: 512, num_inference_steps: 4, batch_size: 1 })
      });
      if (!response.ok) throw new Error(`定妆照 API 响应失败: ${response.status}`);
      const result = await response.json();
      const avatarUrl = result.images?.[0]?.url || result.data?.[0]?.url;
      if (!avatarUrl) throw new Error('定妆照返回中未提取到有效 URL');
      await run(`UPDATE characters SET avatar_url = ? WHERE id = ?`, [avatarUrl, charId]);
      res.json({ success: true, avatar_url: avatarUrl });
    } catch (err) {
      console.error("定妆照渲染失败:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

// 12.1 一键渲染角色三视图 (Generate Character Turnaround)
app.post('/api/characters/:id/generate-turnaround', async (req, res) => {
  const { appearance_prompt, image_api_key, image_api_url, image_model_name } = req.body;
  const charId = req.params.id;

  if (!appearance_prompt) return res.status(400).json({ error: '角色外貌特征描述不能为空' });

  const isDemo = !image_api_key || image_api_key === 'YOUR_IMAGE_KEY_HERE' || image_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockTurnarounds = [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80"
    ];
    const mockUrl = mockTurnarounds[charId % mockTurnarounds.length];
    try {
      await run(`UPDATE characters SET turnaround_url = ? WHERE id = ?`, [mockUrl, charId]);
      res.json({ success: true, turnaround_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: dbErr.message });
    }
  } else {
    const url = image_api_url || "https://api.siliconflow.cn/v1/images/generations";
    const model = image_model_name || "black-forest-labs/FLUX.1-schnell";
    const fullPrompt = `character reference sheet, turnaround sheet showing front, side, and back views, full body, ${appearance_prompt}, white background, detailed anime style, high quality --ar 4:3`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${image_api_key}` },
        body: JSON.stringify({ model, prompt: fullPrompt, width: 1024, height: 768, num_inference_steps: 4, batch_size: 1 })
      });
      if (!response.ok) throw new Error(`三视图 API 响应失败: ${response.status}`);
      const result = await response.json();
      const turnaroundUrl = result.images?.[0]?.url || result.data?.[0]?.url;
      if (!turnaroundUrl) throw new Error('三视图返回中未提取到有效 URL');
      await run(`UPDATE characters SET turnaround_url = ? WHERE id = ?`, [turnaroundUrl, charId]);
      res.json({ success: true, turnaround_url: turnaroundUrl });
    } catch (err) {
      console.error("三视图渲染失败:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

// 12.2 一键渲染角色动作姿态图 (Generate Character Action Pose)
app.post('/api/characters/:id/generate-pose', async (req, res) => {
  const { appearance_prompt, image_api_key, image_api_url, image_model_name } = req.body;
  const charId = req.params.id;

  if (!appearance_prompt) return res.status(400).json({ error: '角色外貌特征描述不能为空' });

  const isDemo = !image_api_key || image_api_key === 'YOUR_IMAGE_KEY_HERE' || image_api_key.trim() === '';

  if (isDemo) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockPoses = [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=512&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=512&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&q=80"
    ];
    const mockUrl = mockPoses[charId % mockPoses.length];
    try {
      await run(`UPDATE characters SET pose_url = ? WHERE id = ?`, [mockUrl, charId]);
      res.json({ success: true, pose_url: mockUrl });
    } catch (dbErr) {
      res.status(500).json({ error: dbErr.message });
    }
  } else {
    const url = image_api_url || "https://api.siliconflow.cn/v1/images/generations";
    const model = image_model_name || "black-forest-labs/FLUX.1-schnell";
    const fullPrompt = `action pose, dynamic angle, full body shot, ${appearance_prompt}, dark cinematic lighting, highly detailed, detailed anime style, high quality --ar 16:9`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${image_api_key}` },
        body: JSON.stringify({ model, prompt: fullPrompt, width: 1024, height: 576, num_inference_steps: 4, batch_size: 1 })
      });
      if (!response.ok) throw new Error(`姿态图 API 响应失败: ${response.status}`);
      const result = await response.json();
      const poseUrl = result.images?.[0]?.url || result.data?.[0]?.url;
      if (!poseUrl) throw new Error('姿态图返回中未提取到有效 URL');
      await run(`UPDATE characters SET pose_url = ? WHERE id = ?`, [poseUrl, charId]);
      res.json({ success: true, pose_url: poseUrl });
    } catch (err) {
      console.error("姿态图渲染失败:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

// 13. 更新分镜板全局画风设定
app.put('/api/storyboard/:id/style', async (req, res) => {
  const { master_seed, style_ref_url, style_preset } = req.body;
  try {
    await run(
      `UPDATE storyboards SET master_seed = COALESCE(?, master_seed), style_ref_url = COALESCE(?, style_ref_url), style_preset = COALESCE(?, style_preset) WHERE id = ?`,
      [master_seed, style_ref_url, style_preset, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 启动服务并初始化数据库
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 2026 AI漫剧工作坊后端启动成功！`);
      console.log(`🔗 接口服务运行在: http://localhost:${PORT}`);
      console.log(`📂 SQLite 数据库已在 backend 目录下初始化完毕。`);
      console.log(`=============================================`);
    });
  })
  .catch(err => {
    console.error("数据库初始化失败，Express 无法启动:", err);
  });
