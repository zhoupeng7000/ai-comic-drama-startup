const express = require('express');
const cors = require('cors');
const { initDatabase, run, all, get } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 模拟的高燃修仙绑定系统数据，用于无Key演示模式
const SIMULATED_RESPONSE = [
  {
    "scene_number": 1,
    "camera_direction": "特写，俯视镜头缓慢推进",
    "visual_description": "暴雨倾盆，泥泞的地面上，落魄的主角林默伤痕累累，右手手骨已经碎裂变形，被一只穿着奢华白金长靴的脚狠狠踩在泥水里。他眼神屈辱但充满怒火，雨水混着血水顺着脸颊流淌。",
    "character_on_screen": "男主角-林默",
    "jimeng_prompt": "一个身穿破旧古代麻衣的18岁少年，黑色头发被暴雨淋湿，满脸泥泞与血水，眼神屈辱而愤怒，咬紧牙关趴在泥水里。一只穿着极尽奢华的白金刺绣古装长靴的脚，狠狠踩在少年血淋淋的右手手背上。大雨倾盆，地面泥泞不堪，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
    "dialogue": "旁白：林默，一个天生无法觉醒气感的废物。今天，却在未婚妻家族的门前，被人像死狗一样踩在脚下……",
    "sound_effects": "哗啦啦的瓢泼暴雨声，沉重屈辱的低音鼓点，沉闷的心跳声。",
    "jianying_voice": "深沉旁白"
  },
  {
    "scene_number": 2,
    "camera_direction": "低角度仰视，傲慢的人物神态",
    "visual_description": "叶家大少爷高傲地站立在暴雨中，手持一把发光的油纸伞，嘴角挂着残忍而轻蔑的冷笑。他身旁站着一位容貌极美但神色极度冷漠、身穿华贵红衣的古装女子（未婚妻），正嫌弃地看着林默。",
    "character_on_screen": "反派-叶大少，未婚妻-叶大小姐",
    "jimeng_prompt": "（开启角色参考）一个身穿华丽白色丝绸古装的傲慢青年男子，手持一把发光的白玉油纸伞站在暴雨中，嘴角挂着残忍的冷笑。他身旁站着一个面容高傲美丽、身穿华贵红色古代霓裳的年轻女子，冷眼俯视地面，眼神充满嫌弃与冷漠。雨水被他们身边的淡淡灵力护罩弹开，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
    "dialogue": "叶大少：“林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？真是不自量力！”",
    "sound_effects": "雨水打在灵力光罩上的噼啪声，冷酷嘲讽的冷笑声。",
    "jianying_voice": "冷酷男神"
  },
  {
    "scene_number": 3,
    "camera_direction": "特写，神异变幻，极速拉近",
    "visual_description": "泥水中的林默突然狂笑，他的双眼紧闭瞬间睁开，双眸竟变成了耀眼的蓝色神龙瞳孔，眼角散发出丝丝蓝色雷电电流。他的右手臂上，隐约浮现出一层闪烁着蔚蓝色科技电路光芒的古老龙鳞纹路。",
    "character_on_screen": "男主角-林默",
    "jimeng_prompt": "（开启角色参考）趴在泥水中的黑发古代少年突然猛地抬头，他原本漆黑的双眼变成了极其刺眼、散发着蔚蓝色雷电光芒的龙之瞳孔。他的右臂皮肤上浮现出闪烁着蓝色科技电路纹路的光彩龙鳞，暴雨在他的愤怒注视下仿佛在空中静止悬浮，光芒万丈，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
    "dialogue": "系统音：“叮！太古神龙系统绑定成功！检测到宿主声音受到致命威胁，自动启动神龙逆天血脉！”\n林默：“（沙哑冷笑）哈哈哈哈……叶家，你们会后悔的！”",
    "sound_effects": "清脆的电子提示音（叮！），高频能量充电的嗡鸣声，惊心动魄的金属震颤音。",
    "jianying_voice": "系统机械音（前半句）+ 热血少年（后半句）"
  },
  {
    "scene_number": 4,
    "camera_direction": "全景，高燃爆发英雄镜头",
    "visual_description": "一股粗壮无比的蓝色神龙光柱从林默身上轰然爆发，直冲云霄。一条由蓝色科技雷电化成的万丈神龙虚影围绕着光柱盘旋怒吼，瞬间将周围的暴雨和叶大少身边的灵力护罩全部震碎，大地颤抖！",
    "character_on_screen": "男主角-林默，神龙虚影",
    "jimeng_prompt": "（开启角色参考）一个黑发少年被一根冲天而起的巨大蓝色科技雷电光柱包围，一条万丈巨大的蓝色半透明东方神龙虚影在云雾与雷电中盘旋怒吼。强大的冲击波将周围的大地撕裂，天空的云层被冲散，场面史诗级震撼，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9",
    "dialogue": "旁白：太古神龙觉醒，仙魔皆要臣服！点击评论区小说链接，看凡骨废物林默，如何踏碎万古天骄！",
    "sound_effects": "震耳欲聋的神龙怒吼声，巨大的能量爆炸声，大气磅礴的燃系国风交响乐高潮，突然黑屏切断。",
    "jianying_voice": "深沉旁白"
  }
];

const SYSTEM_PROMPT = `
你是一个国内顶级的AI漫剧导演和视觉提示词专家，专门服务于抖音/微信视频号上的高燃修仙与古装奇幻漫剧。
你的任务是将用户输入的原始网文片段，重写并拆解为适合【即梦AI (Jimeng AI)】出图的中文分镜脚本。
必须输出符合以下要求的 JSON 数组，不要返回任何 Markdown 标记或多余的解释文本，只返回 JSON 格式的内容。

输出的 JSON 数组中每个元素代表一个分镜镜头，格式如下：
[
  {
    "scene_number": 1,
    "camera_direction": "镜头的景别与运动方向，例如：全景，背景雨夜，镜头缓慢向下拉升",
    "visual_description": "中文精细画面描述，包含环境色调、光影、人物表情特征",
    "character_on_screen": "画面中出现的人物名字，如 '无' 或 '男主角-叶凌天'",
    "jimeng_prompt": "专门给即梦AI(Jimeng AI)的【中文】画面提示词。如果是镜头2及以后，必须在开头加上'(开启角色参考)'字样，并对角色的核心外貌特征（如：白发如雪的帅气古代少年，穿着黑金道袍）进行一致性重述。后缀统一加入画风描述：'，写实国风动漫风格，体积光照，极度精细，电影级构图，8k超高清 --ar 16:9'",
    "dialogue": "角色的台词或旁白，需极具爽文情绪张力",
    "sound_effects": "画面的背景音效和背景音乐（BGM）建议，例如：惊雷声，清脆的剑鸣，燃系国风电子乐",
    "jianying_voice": "推荐的剪映专业版免费配音音色，例如：'冷酷男神'、'霸气御姐'、'热血少年'、'温柔师姐'、'深沉旁白'、'系统机械音'"
  }
]

请确保：
1. 剧本严格保留爽文节奏：前三个镜头必须有强烈的视觉和冲突，抓住观众前3秒注意力。
2. 默认视觉画风锁定为：【唯美写实国风动漫插画风格】。
3. 提示词非常细致，善于描述光影与微小动效（如：发光粒子，雨滴在空中停滞，衣角随风飘动），完美适合即梦AI的图生视频。
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

    // 批量保存分镜镜头
    for (const scene of storyboardData) {
      await run(
        `INSERT INTO scenes (storyboard_id, scene_number, camera_direction, visual_description, character_on_screen, jimeng_prompt, dialogue, sound_effects, jianying_voice, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          scene.image_url || null
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
  const { title, novel_text, scenes } = req.body;

  try {
    // 更新主表
    if (title || novel_text) {
      await run(
        `UPDATE storyboards SET title = COALESCE(?, title), novel_text = COALESCE(?, novel_text) WHERE id = ?`,
        [title, novel_text, id]
      );
    }

    // 如果提供了 scenes，则先删除旧分镜，再重新写入
    if (scenes && Array.isArray(scenes)) {
      await run(`DELETE FROM scenes WHERE storyboard_id = ?`, [id]);
      for (const scene of scenes) {
        await run(
          `INSERT INTO scenes (storyboard_id, scene_number, camera_direction, visual_description, character_on_screen, jimeng_prompt, dialogue, sound_effects, jianying_voice, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            scene.image_url || null
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
