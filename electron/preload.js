const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getEvents: () => ipcRenderer.invoke('events:getAll'),
  addEvent: (data) => ipcRenderer.invoke('events:add', data),
  updateEvent: (id, data) => ipcRenderer.invoke('events:update', id, data),
  deleteEvent: (id) => ipcRenderer.invoke('events:delete', id),
  celebrate: (id) => ipcRenderer.invoke('events:celebrate', id),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  openWidget: (id) => ipcRenderer.invoke('widget:open', id),
  closeWidget: (id) => ipcRenderer.invoke('widget:close', id),
  onEventsUpdated: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('events:updated', listener);
    return () => ipcRenderer.removeListener('events:updated', listener);
  },
  getSetting: (key) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  listWidgets: () => ipcRenderer.invoke('widget:list'),
  getVersion: () => ipcRenderer.invoke('app:version'),
})
