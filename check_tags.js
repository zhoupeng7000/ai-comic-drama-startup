const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Find the return statement inside App component
const returnMatch = content.match(/return\s*\(\s*(<div[\s\S]+<\/div>)\s*\);\s*\n\s*\}/);
if (!returnMatch) {
  console.log("Could not locate main return statement in App.jsx via regex.");
  process.exit(0);
}

const jsxText = returnMatch[1];
console.log("JSX length:", jsxText.length);

// Basic tag tokenizer
const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/g;
let match;
const stack = [];
let lines = jsxText.split('\n');

let tagCount = 0;
// We'll parse the tags manually
const textWithTags = jsxText;
let lastIndex = 0;

console.log("Starting tag balance validation...");

const tags = [];
while ((match = tagRegex.exec(jsxText)) !== null) {
  const [fullTag, tagName, selfClosing] = match;
  const isClosing = fullTag.startsWith('</');
  
  if (selfClosing || ['input', 'img', 'br', 'hr', 'video'].includes(tagName)) {
    // Self-closing tag
    continue;
  }
  
  if (isClosing) {
    if (stack.length === 0) {
      console.error(`Error: Extra closing tag </${tagName}> at index ${match.index}`);
    } else {
      const top = stack.pop();
      if (top.name !== tagName) {
        console.error(`Error: Mismatched tag. Opened <${top.name}> at index ${top.index}, but closed </${tagName}> at index ${match.index}`);
      }
    }
  } else {
    stack.push({ name: tagName, index: match.index });
  }
}

if (stack.length > 0) {
  console.error("Error: The following tags were opened but never closed:");
  stack.forEach(t => console.error(` - <${t.name}> at index ${t.index}`));
} else {
  console.log("SUCCESS: All JSX tags in the return statement are perfectly balanced!");
}
