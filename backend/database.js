const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. 创建 storyboards 主表
      db.run(`
        CREATE TABLE IF NOT EXISTS storyboards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          novel_text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // 2. 创建 scenes 子表
      db.run(`
        CREATE TABLE IF NOT EXISTS scenes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          storyboard_id INTEGER NOT NULL,
          scene_number INTEGER NOT NULL,
          camera_direction TEXT,
          visual_description TEXT,
          character_on_screen TEXT,
          jimeng_prompt TEXT,
          dialogue TEXT,
          sound_effects TEXT,
          jianying_voice TEXT,
          image_url TEXT,
          FOREIGN KEY (storyboard_id) REFERENCES storyboards (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) return reject(err);
        
        // 动态迁移：检查是否存在 image_url 列，如果不存在则添加
        db.all("PRAGMA table_info(scenes)", (pragmaErr, columns) => {
          if (pragmaErr) return reject(pragmaErr);
          const hasImageUrl = columns.some(col => col.name === 'image_url');
          if (!hasImageUrl) {
            db.run("ALTER TABLE scenes ADD COLUMN image_url TEXT", (alterErr) => {
              if (alterErr) return reject(alterErr);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
}

// 辅助数据库查询封装为 Promise
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this.lastID, this.changes
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = {
  db,
  initDatabase,
  run,
  all,
  get
};
