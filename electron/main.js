const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, screen, autoUpdater } = require('electron')
const path = require('path')
const fs = require('fs')
const { pathToFileURL } = require('url')
const iconPath = path.join(__dirname, '..', 'assets', 'icon.png')
const { init, getAllEvents, addEvent, updateEvent, deleteEvent, markCelebrated, getWidgets, saveWidget, removeWidget, getEventById, cleanupOrphanedWidgets, getSetting, setSetting, closeDb } = require('./db')

const isDev = process.env.VITE_DEV === 'true'

let mainWindow = null
const widgetWindows = new Map()
let tray = null
let isQuitting = false
let isAutoStarting = false

function createWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    return
  }

  mainWindow = new BrowserWindow({
    width: 544,
    height: 644,
    resizable: false,
    frame: false,
    show: false,
    transparent: true,
    backgroundColor: '#00000000',
    skipTaskbar: false,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      experimentalFeatures: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    if (!isAutoStarting) {
      mainWindow.show()
    }
  })

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

function clampWidgetBounds(x, y, w, h) {
  const minW = 160, maxW = 400, minH = 100, maxH = 300
  const cw = Math.max(minW, Math.min(maxW, w))
  const ch = Math.max(minH, Math.min(maxH, h))

  const displays = screen.getAllDisplays()
  let targetDisplay = screen.getPrimaryDisplay()

  for (const d of displays) {
    const area = d.workArea || d.bounds
    if (x + cw > area.x && x < area.x + area.width && y + ch > area.y && y < area.y + area.height) {
      targetDisplay = d
      break
    }
  }

  const area = targetDisplay.workArea || targetDisplay.bounds
  const cx = Math.max(area.x, Math.min(area.x + area.width - cw, x))
  const cy = Math.max(area.y, Math.min(area.y + area.height - ch, y))

  return { x: cx, y: cy, width: cw, height: ch }
}

function createWidgetWindow(eventId, x, y, w, h, options = {}) {
  if (widgetWindows.has(eventId)) {
    return
  }

  const bounds = clampWidgetBounds(x, y, w, h)
  const isBootRestore = options.isBootRestore === true

  const widgetWin = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: 160,
    minHeight: 100,
    maxWidth: 400,
    maxHeight: 300,
    resizable: true,
    frame: false,
    show: false,
    transparent: true,
    backgroundColor: '#00000000',
    skipTaskbar: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      experimentalFeatures: false,
    },
  })

  widgetWindows.set(eventId, widgetWin)

  widgetWin.once('ready-to-show', () => {
    if (isBootRestore) {
      widgetWin.show()
    } else {
      widgetWin.showInactive()
    }
    if (typeof widgetWin.setAlwaysOnBottom === 'function') {
      widgetWin.setAlwaysOnBottom(true)
    }
  })

  widgetWin.on('moved', () => {
    const [newX, newY] = widgetWin.getPosition()
    const [newW, newH] = widgetWin.getSize()
    saveWidget(eventId, newX, newY, newW, newH)
  })

  widgetWin.on('resized', () => {
    const [newX, newY] = widgetWin.getPosition()
    const [newW, newH] = widgetWin.getSize()
    saveWidget(eventId, newX, newY, newW, newH)
  })

  widgetWin.on('closed', () => {
    widgetWindows.delete(eventId)
  })

  widgetWin.webContents.on('did-fail-load', () => {
    console.error(`Widget ${eventId} failed to load, removing.`)
    removeWidget(eventId)
    widgetWin.close()
  })

  if (isBootRestore) {
    setTimeout(() => {
      if (!widgetWin.isDestroyed()) {
        widgetWin.show()
        if (typeof widgetWin.setAlwaysOnBottom === 'function') {
          widgetWin.setAlwaysOnBottom(true)
        }
      }
    }, 1200)
  }

  const url = isDev
    ? `http://localhost:5173?widget=${eventId}`
    : `${pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href}?widget=${eventId}`

  widgetWin.loadURL(url)
}

function restoreWidgets(isBootRestore = false) {
  cleanupOrphanedWidgets()
  const widgets = getWidgets()
  widgets.forEach((w, index) => {
    if (getEventById(w.event_id)) {
      const delay = isBootRestore ? index * 250 : 0
      setTimeout(() => {
        if (!widgetWindows.has(w.event_id)) {
          createWidgetWindow(w.event_id, w.x, w.y, w.width, w.height, { isBootRestore })
        }
      }, delay)
    } else {
      removeWidget(w.event_id)
    }
  })
}

let updateReady = false

function setupAutoUpdater() {
  if (isDev) return

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available:', info.version)
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Downloading update: ${Math.round(progress.percent)}%`)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info.version)
    updateReady = true
    tray?.setContextMenu(buildTrayMenu())
    new Notification({
      title: 'Minimaldoro Update Ready',
      body: `Version ${info.version} is ready to install. Restart from the tray menu to apply.`,
    }).show()
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto-update error:', err)
  })

  autoUpdater.checkForUpdates()
}

function buildTrayMenu() {
  const autoStart = getSetting('autoStart') === 'true'
  const items = [
    { label: 'Open Minimaldoro', click: () => { createWindow() } },
    { type: 'separator' },
    {
      label: autoStart ? '✓ Auto-start on login' : '  Auto-start on login',
      click: () => {
        const newVal = !autoStart
        setSetting('autoStart', String(newVal))
        app.setLoginItemSettings({ openAtLogin: newVal, openAsHidden: true })
        tray.setContextMenu(buildTrayMenu())
      }
    },
  ]

  if (updateReady) {
    items.push({ type: 'separator' })
    items.push({
      label: 'Restart to install update',
      click: () => {
        isQuitting = true
        autoUpdater.quitAndInstall(false, true)
      }
    })
  }

  items.push({ type: 'separator' })
  items.push({ label: 'Quit', click: () => { isQuitting = true; app.quit() } })

  return Menu.buildFromTemplate(items)
}

function broadcastUpdate() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('events:updated')
  }
  widgetWindows.forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('events:updated')
    }
  })
}

function registerIpcHandlers() {
  ipcMain.handle('events:getAll', () => getAllEvents())

  ipcMain.handle('events:add', (_, data) => {
    const result = addEvent(data)
    broadcastUpdate()
    return result
  })

  ipcMain.handle('events:update', (_, id, data) => {
    updateEvent(id, data)
    broadcastUpdate()
  })

  ipcMain.handle('events:delete', (_, id) => {
    deleteEvent(id)
    // Close widget if one exists for this event
    const win = widgetWindows.get(id)
    if (win && !win.isDestroyed()) win.close()
    removeWidget(id)
    broadcastUpdate()
  })

  ipcMain.handle('events:celebrate', (_, id) => {
    const { markCelebrated } = require('./db')
    markCelebrated(id)
    broadcastUpdate()
  })

  ipcMain.handle('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  ipcMain.handle('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.handle('widget:open', (event, eventId) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const [x, y] = win.getPosition()
    saveWidget(eventId, x + 50, y + 50, 220, 130)
    createWidgetWindow(eventId, x + 50, y + 50, 220, 130, { isBootRestore: false })
  })

  ipcMain.handle('widget:close', (_, eventId) => {
    removeWidget(eventId)
    const win = widgetWindows.get(eventId)
    if (win) win.close()
  })

  ipcMain.handle('widget:list', () => {
    return Array.from(widgetWindows.keys())
  })

  ipcMain.handle('settings:get', (_, key) => {
    return getSetting(key)
  })

  ipcMain.handle('settings:set', (_, key, value) => {
    setSetting(key, value)
    if (key === 'autoStart') {
      app.setLoginItemSettings({ openAtLogin: value === 'true', openAsHidden: true })
      tray.setContextMenu(buildTrayMenu())
    }
  })

  ipcMain.handle('app:version', () => {
    return app.getVersion()
  })
}

let notificationInterval = null;

function startNotificationScheduler() {
  if (notificationInterval) clearInterval(notificationInterval);
  notificationInterval = setInterval(() => {
    try {
      const events = getAllEvents();
      const now = Date.now();
      events.forEach(e => {
        if (e.celebrated) return;
        const [y, m, d] = e.date.split('-').map(Number)
        const eventTime = new Date(y, m - 1, d).getTime();
        const diff = eventTime - now;
        if (diff > 0) {
          const reminderMs = parseReminder(e.reminder);
          if (diff <= reminderMs && !e.notified) {
            const { markNotified } = require('./db')
            markNotified(e.id);
            const notif = new Notification({
              title: 'Minimaldoro',
              body: `${e.title} is coming up!`,
            });
            notif.on('click', () => {
              if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.focus();
              } else {
                createWindow();
              }
            });
            notif.show();
          }
        }
      });
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }, 60000);
}

function parseReminder(str) {
  const map = {
    'At time of event': 0,
    '2 hours before': 2 * 60 * 60 * 1000,
    '3 hours before': 3 * 60 * 60 * 1000,
    '6 hours before': 6 * 60 * 60 * 1000,
    '1 day before': 24 * 60 * 60 * 1000,
  }
  return map[str] !== undefined ? map[str] : 2 * 60 * 60 * 1000
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    createWindow()
  })

  app.whenReady().then(() => {
    try {
      init()
      console.log('DB initialized')
    } catch (e) {
      console.error('DB init failed:', e)
    }

    // Set up tray
    try {
      if (fs.existsSync(iconPath)) {
        tray = new Tray(iconPath)
        tray.setToolTip('Minimaldoro')
        tray.setContextMenu(buildTrayMenu())
        tray.on('click', () => {
          createWindow()
        })
      } else {
        console.warn('Tray icon not found at', iconPath)
      }
    } catch (e) {
      console.error('Failed to create tray:', e)
    }

    // Apply auto-start setting on startup; enable by default so widgets restore on boot
    let autoStart = getSetting('autoStart')
    if (autoStart === null || autoStart === undefined) {
      autoStart = 'true'
      setSetting('autoStart', 'true')
    }
    if (autoStart === 'true') {
      app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true })
      isAutoStarting = true
    }

    registerIpcHandlers()
    setupAutoUpdater()
    createWindow()
    restoreWidgets(isAutoStarting)
    startNotificationScheduler()

    if (isAutoStarting) {
      mainWindow.hide()
      setTimeout(() => {
        isAutoStarting = false
      }, 2000)
    }
  })

  process.on('uncaughtException', (err) => {
    console.error('Uncaught:', err)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.on('window-all-closed', () => {
    // Overridden to keep app running in tray
  })

  app.on('before-quit', () => {
    closeDb()
  })
}
