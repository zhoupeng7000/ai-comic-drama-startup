#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
2026 AI漫剧国内创业套件 - 剧本自动分镜与中文Prompt生成器（即梦AI平替版）

本脚本演示了如何使用大语言模型（LLM）API将原始的中文网文或故事大纲，
自动化转化为包含：分镜镜头、画质细节、适用于即梦AI/LiblibAI的角色一致性中文提示词、剪映专业版免费配音角色和音效的结构化JSON数据。

使用前准备：
1. 安装依赖：pip install openai requests
2. 填入您的 API Key 和 Base URL（如DeepSeek、阿里、字节火山引擎等国内大模型平台）
"""

import os
import json
import requests
import time

# ================= 配置区域 =================
API_KEY = os.getenv("LLM_API_KEY", "YOUR_API_KEY_HERE")
API_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1/chat/completions") # 可修改为国内大模型接口
MODEL_NAME = "gpt-4o-mini" # 推荐使用 deepseek-chat, doubao-pro-4k 等高性价比中文模型
# ============================================

SYSTEM_PROMPT = """
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
"""

# 当用户没有配置 API Key 时，用于展示的完美模拟转换结果
SIMULATED_RESPONSE = [
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
    "dialogue": "系统音：“叮！太古神龙系统绑定成功！检测到宿主濒死，自动启动神龙逆天血脉！”\n林默：“（沙哑冷笑）哈哈哈哈……叶家，你们会后悔的！”",
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
]

def generate_chinese_storyboard(raw_story_text):
    """
    调用国内/国际大模型API，将原始小说文本转化为即梦AI适用的中文漫剧分镜JSON
    """
    if API_KEY == "YOUR_API_KEY_HERE":
        print("[提示] 检测到您目前未配置 LLM_API_KEY，脚本将自动切换到【极高拟真度模拟运行模式】...")
        print("正在模拟发送剧本给大模型大脑...\n")
        time.sleep(1.5) # 模拟网络延迟
        print("[AI思考中] 正在将原始故事拆解为4个高燃分镜...")
        time.sleep(1.5)
        print("[提示词优化] 正在生成即梦AI专属的‘智能角色参考’中文Prompt...")
        time.sleep(1)
        print("[音效设计] 正在匹配剪映专业版的高品质音效与免费发音人角色...")
        time.sleep(0.5)
        return SIMULATED_RESPONSE

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    data = {
        "model": MODEL_NAME,
        "response_format": { "type": "json_object" }, # 强制JSON输出
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"请把以下故事片段改写为爆款修仙漫剧中文分镜脚本，要求节奏紧凑、爽感十足：\n\n{raw_story_text}"}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        print(f"[错误] 调用 API 失败: {e}")
        return None

if __name__ == "__main__":
    # 模拟一段热门修仙爽文段落
    sample_novel_text = """
    天空正下着倾盆大雨，雷鸣声在苍穹间回荡。
    林默被叶家大少爷狠狠地踩在泥水里，右手手骨已经粉碎性骨折。
    “林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？”叶大少冷笑道，身边站着他高傲的未婚妻。
    林默咬紧牙齿，泥水混着血水流进嘴里。他忽然笑了，因为就在这一瞬间，他的脑海深处传来了一声清脆的电子提示音：
    【叮！太古神龙系统绑定成功，检测到宿主正在受到致命威胁，自动启动神龙逆天血脉！】
    """

    print("==================================================")
    print("        2026 AI漫剧工作坊 - 剧本自动分镜工具测试")
    print("==================================================")
    print("\n--- 待转换的小说文本段落 ---")
    print(sample_novel_text.strip())
    print("---------------------------------------------")
    print("\n正在生成国内零成本AI漫剧分镜脚本，请稍候...")

    storyboard = generate_chinese_storyboard(sample_novel_text)

    if storyboard:
        output_filename = "auto_generated_storyboard_chinese.json"
        # 确保保存的路径在当前脚本同目录下
        script_dir = os.path.dirname(os.path.abspath(__file__))
        target_path = os.path.join(script_dir, output_filename)
        
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(storyboard, f, ensure_ascii=False, indent=2)
            
        print("\n==================================================")
        print(f"[成功] 转换完成！分镜表已保存至:")
        print(f"🔗 {target_path}")
        print("==================================================")
        print("\n🚀 脚本输出预览 (镜头 1 & 镜头 3):")
        print(f"\n【镜头 1】\n- 景别动作: {storyboard[0]['camera_direction']}")
        print(f"- 即梦出图提示词: {storyboard[0]['jimeng_prompt']}")
        print(f"- 剪映配音台词: {storyboard[0]['dialogue']}")
        print(f"- 推荐音色: {storyboard[0]['jianying_voice']}")
        
        print(f"\n【镜头 3 (开启角色保持)】\n- 景别动作: {storyboard[2]['camera_direction']}")
        print(f"- 即梦出图提示词: {storyboard[2]['jimeng_prompt']}")
        print(f"- 剪映配音台词: {storyboard[2]['dialogue']}")
        print(f"- 推荐音色: {storyboard[2]['jianying_voice']}")
        print("\n--------------------------------------------------")
        print("💡 下一步实操建议：")
        print("1. 你可以直接在当前目录下双击打开 'auto_generated_storyboard_chinese.json' 查看完整的分镜设计。")
        print("2. 复制【镜头1】的即梦提示词到即梦AI的‘文生图’控制台，生成你的第一张‘角色母图’！")
        print("3. 当你申请了国内大模型的API KEY后，只需修改本脚本头部的 API_KEY 和 API_URL 变量，即可无限量自动化解析你喜欢的任何网文小说！")
    else:
        print("\n[错误] 转换失败，请检查网络或配置。")
