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
      });

      // 3. 创建 characters 角色档案表
      db.run(`
        CREATE TABLE IF NOT EXISTS characters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          storyboard_id INTEGER NOT NULL,
          name VARCHAR(50) NOT NULL,
          role_type VARCHAR(20) DEFAULT '主角',
          avatar_url TEXT,
          turnaround_url TEXT,
          pose_url TEXT,
          appearance_prompt TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (storyboard_id) REFERENCES storyboards(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // 动态迁移：characters 表 - 新增三视图与姿态图控制字段
      db.all("PRAGMA table_info(characters)", (pragmaErr, columns) => {
        if (pragmaErr) return reject(pragmaErr);
        const hasTurnaround = columns.some(col => col.name === 'turnaround_url');
        const hasPose = columns.some(col => col.name === 'pose_url');

        const charMigrations = [];
        if (!hasTurnaround) {
          charMigrations.push(new Promise((res, rej) => {
            db.run("ALTER TABLE characters ADD COLUMN turnaround_url TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasPose) {
          charMigrations.push(new Promise((res, rej) => {
            db.run("ALTER TABLE characters ADD COLUMN pose_url TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }

        Promise.all(charMigrations).catch(err => reject(err));
      });


      // 动态迁移：storyboards 表 - 新增画风一致性控制字段
      db.all("PRAGMA table_info(storyboards)", (pragmaErr, columns) => {
        if (pragmaErr) return reject(pragmaErr);
        const hasMasterSeed = columns.some(col => col.name === 'master_seed');
        const hasStyleRefUrl = columns.some(col => col.name === 'style_ref_url');
        const hasStylePreset = columns.some(col => col.name === 'style_preset');

        const sbMigrations = [];
        if (!hasMasterSeed) {
          sbMigrations.push(new Promise((res, rej) => {
            db.run("ALTER TABLE storyboards ADD COLUMN master_seed INTEGER DEFAULT -1", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasStyleRefUrl) {
          sbMigrations.push(new Promise((res, rej) => {
            db.run("ALTER TABLE storyboards ADD COLUMN style_ref_url TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasStylePreset) {
          sbMigrations.push(new Promise((res, rej) => {
            db.run("ALTER TABLE storyboards ADD COLUMN style_preset VARCHAR(50) DEFAULT '国风动漫'", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }

        Promise.all(sbMigrations).catch(err => reject(err));
      });

      // 动态迁移：scenes 表 - 检查并添加缺失列
      db.all("PRAGMA table_info(scenes)", (pragmaErr, columns) => {
        if (pragmaErr) return reject(pragmaErr);
        const hasImageUrl = columns.some(col => col.name === 'image_url');
        const hasVideoUrl = columns.some(col => col.name === 'video_url');
        const hasCharacterIds = columns.some(col => col.name === 'character_ids');
        const hasCameraMotion = columns.some(col => col.name === 'camera_motion');
        const hasMotionIntensity = columns.some(col => col.name === 'motion_intensity');

        const migrationPromises = [];
        if (!hasImageUrl) {
          migrationPromises.push(new Promise((res, rej) => {
            db.run("ALTER TABLE scenes ADD COLUMN image_url TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasVideoUrl) {
          migrationPromises.push(new Promise((res, rej) => {
            db.run("ALTER TABLE scenes ADD COLUMN video_url TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasCharacterIds) {
          migrationPromises.push(new Promise((res, rej) => {
            db.run("ALTER TABLE scenes ADD COLUMN character_ids TEXT", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasCameraMotion) {
          migrationPromises.push(new Promise((res, rej) => {
            db.run("ALTER TABLE scenes ADD COLUMN camera_motion VARCHAR(50) DEFAULT 'static'", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }
        if (!hasMotionIntensity) {
          migrationPromises.push(new Promise((res, rej) => {
            db.run("ALTER TABLE scenes ADD COLUMN motion_intensity VARCHAR(20) DEFAULT 'low'", (alterErr) => {
              if (alterErr) rej(alterErr);
              else res();
            });
          }));
        }

        Promise.all(migrationPromises)
          .then(() => resolve())
          .catch(err => reject(err));
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
