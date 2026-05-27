#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
2026 AI漫剧创业工具箱 - 剧本自动分镜与Prompt生成器（模板）

本脚本演示了如何使用大语言模型（LLM）API将原始的网文或故事大纲，
自动化转化为包含：分镜镜头、画质细节、角色一致性Midjourney/SD提示词、配音和音效的结构化JSON数据。
这是实现AI漫剧工厂化、规模化生产的重要基础设施。

使用前准备：
1. 安装依赖：pip install openai requests
2. 填入您的 API Key 和 Base URL
"""

import os
import json
import requests

# ================= 配置区域 =================
API_KEY = os.getenv("LLM_API_KEY", "YOUR_API_KEY_HERE")
API_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1/chat/completions") # 也可替换为国内大模型厂商如火山引擎、DeepSeek、阿里等
MODEL_NAME = "gpt-4o-mini" # 或 deepseek-chat, doubao-pro 等高效模型
# ============================================

SYSTEM_PROMPT = """
你是一个顶级的AI漫剧导演和视觉提示词专家。你的任务是把用户输入的原始网文片段，重写并拆解为适合AI漫剧视频生成的【分镜脚本】。
必须输出符合以下要求的 JSON 数组，不要返回任何 Markdown 标记或多余的解释文本，只返回 JSON 格式的内容。

输出的 JSON 数组中每个元素代表一个分镜镜头（通常1.5分钟的视频需要8-12个分镜），格式如下：
[
  {
    "scene_number": 1,
    "camera_direction": "镜头的景别与运动方向，例如：特写，背景雨夜，镜头缓慢向下拉升",
    "visual_description": "中文精细画面描述，包含环境色调、光影、人物特征",
    "character_on_screen": "画面中出现的人物名字，如 '无' 或 '男主角-李轩'",
    "midjourney_prompt": "专门给Midjourney或Stable Diffusion的英文提示词，必须符合现代AI出图规范。如果是特定角色，必须附带其标志性特征（如: white-haired cool guy in black coat），并且画面为16:9比例：--ar 16:9 --v 6.0",
    "dialogue": "角色的台词或旁白，需极具情绪张力",
    "sound_effects": "画面的背景音效和背景音乐（BGM）建议，例如：惊雷声，急促的鼓点，雨声"
  }
]

请确保：
1. 前三个镜头必须有强烈的视觉和剧情冲突，抓住用户眼球。
2. 保持视觉风格一致，默认选择【赛博朋克+国风修仙厚涂】画风。
3. 英文提示词中避免使用Midjourney禁词，注重光影和微小的微动控制（如: blinking, steam rising, particles glowing）。
"""

def generate_storyboard(raw_story_text):
    """
    调用大模型，将原始小说文本转化为漫剧分镜JSON
    """
    if API_KEY == "YOUR_API_KEY_HERE":
        print("[警告] 请先配置您的 API_KEY！下面将展示模拟的转换流程...")
        # 模拟输出
        return None

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    data = {
        "model": MODEL_NAME,
        "response_format": { "type": "json_object" }, # 强制输出JSON
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"请把以下故事片段改写为爆款漫剧分镜脚本，要求极其精炼、高燃：\n\n{raw_story_text}"}
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
    # 模拟一段网文开头
    sample_novel_text = """
    天空正下着倾盆大雨，雷鸣声在苍穹间回荡。
    林默被叶家大少爷狠狠地踩在泥水里，右手手骨已经粉碎性骨折。
    “林默，你这个连气感都无法觉醒的废物，也配向我们叶家提亲？”叶大少冷笑道，身边站着他高傲的未婚妻。
    林默咬紧牙齿，泥水混着血水流进嘴里。他忽然笑了，因为就在这一瞬间，他的脑海深处传来了一声清脆的电子提示音：
    【叮！太古神龙系统绑定成功，检测到宿主正在受到致命威胁，自动启动神龙逆天血脉！】
    """

    print("--- 原始网文段落 ---")
    print(sample_novel_text.strip())
    print("\n正在转换中，请稍候...")

    storyboard = generate_storyboard(sample_novel_text)

    if storyboard:
        output_filename = "auto_generated_storyboard.json"
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(storyboard, f, ensure_ascii=False, indent=2)
        print(f"\n[成功] 脚本已自动解析并保存至: {output_filename}")
        print("您现在可以直接复制文件中的英文 midjourney_prompt 去画图了！")
    else:
        print("\n[提示] 暂未获取到API响应。你可以参考同目录下的 'sample_storyboard.json' 查看手工编写的优秀分镜示范！")
