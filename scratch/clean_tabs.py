import re
import os

app_path = r"c:\Users\wuya7\.gemini\antigravity\scratch\ai-comic-drama-startup\frontend\src\App.jsx"

with open(app_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate "</header>" around line 1330
header_end_tag = "</header>"
header_idx = content.find(header_end_tag)
if header_idx == -1:
    print("Error: Could not find </header>")
    exit(1)

# Locate "<main className={scenes.length ==="
main_tag = '<main className={scenes.length === 0 ? "wizard-dashboard-layout"'
main_idx = content.find(main_tag)
if main_idx == -1:
    print("Error: Could not find main tag start")
    exit(1)

# Find the end of the main tag declaration (closing '>')
main_end_idx = content.find('>', main_idx)
if main_end_idx == -1:
    print("Error: Could not find end of main tag")
    exit(1)

# Slice the file
before_header = content[:header_idx + len(header_end_tag)]
after_main = content[main_end_idx + 1:]

# Construct new main tag
new_main_tag = '\n\n      <main className={scenes.length === 0 ? "wizard-dashboard-layout" : "dashboard-grid"}>'

new_content = before_header + new_main_tag + after_main

# Save
with open(app_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("App.jsx cleaned up successfully programmatically!")
