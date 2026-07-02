const Database = require('better-sqlite3')
const { app } = require('electron')
const path = require('path')

let db

function closeDb() {
  if (db) {
    try { db.close() } catch {}
  }
}

function init() {
  const dbPath = path.join(app.getPath('userData'), 'countdown.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      color TEXT DEFAULT '#ffb83e',
      reminder TEXT DEFAULT '2 hours before',
      celebrated INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS widgets (
      event_id INTEGER PRIMARY KEY,
      x INTEGER,
      y INTEGER,
      width INTEGER DEFAULT 220,
      height INTEGER DEFAULT 130
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `)
  try {
    db.exec(`ALTER TABLE events ADD COLUMN notified INTEGER DEFAULT 0`)
  } catch (e) {
    // Column already exists
  }
  try {
    db.exec(`ALTER TABLE widgets ADD COLUMN width INTEGER DEFAULT 220`)
    db.exec(`ALTER TABLE widgets ADD COLUMN height INTEGER DEFAULT 130`)
  } catch (e) {
    // Columns already exist
  }
}

function getAllEvents() {
  return db.prepare('SELECT * FROM events ORDER BY date ASC').all()
}

function addEvent({ title, date, color, reminder }) {
  const stmt = db.prepare(
    'INSERT INTO events (title, date, color, reminder) VALUES (?, ?, ?, ?)'
  )
  const result = stmt.run(
    title,
    date,
    color || '#ffb83e',
    reminder || '2 hours before'
  )
  return { id: Number(result.lastInsertRowid) }
}

function updateEvent(id, { title, date, color, reminder }) {
  db.prepare(
    'UPDATE events SET title = ?, date = ?, color = ?, reminder = ?, notified = 0 WHERE id = ?'
  ).run(title, date, color, reminder || '2 hours before', id)
}

function deleteEvent(id) {
  db.prepare('DELETE FROM events WHERE id = ?').run(id)
}

function markCelebrated(id) {
  db.prepare('UPDATE events SET celebrated = 1 WHERE id = ?').run(id)
}

function markNotified(id) {
  db.prepare('UPDATE events SET notified = 1 WHERE id = ?').run(id)
}

function getWidgets() {
  return db.prepare('SELECT * FROM widgets').all()
}

function getEventById(id) {
  return db.prepare('SELECT id FROM events WHERE id = ?').get(id)
}

function cleanupOrphanedWidgets() {
  db.prepare('DELETE FROM widgets WHERE event_id NOT IN (SELECT id FROM events)').run()
}

function saveWidget(eventId, x, y, width, height) {
  db.prepare(
    'INSERT INTO widgets (event_id, x, y, width, height) VALUES (?, ?, ?, ?, ?) ON CONFLICT(event_id) DO UPDATE SET x=excluded.x, y=excluded.y, width=excluded.width, height=excluded.height'
  ).run(eventId, x, y, width || 220, height || 130)
}

function removeWidget(eventId) {
  db.prepare('DELETE FROM widgets WHERE event_id = ?').run(eventId)
}

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
  return row ? row.value : null
}

function setSetting(key, value) {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
}

module.exports = { 
  init, getAllEvents, addEvent, updateEvent, deleteEvent, markCelebrated, markNotified, getWidgets, saveWidget, removeWidget, getEventById, cleanupOrphanedWidgets, getSetting, setSetting, closeDb
}
