export function getEvents() {
  return window.api.getEvents()
}

export function addEvent(data) {
  return window.api.addEvent(data)
}

export function updateEvent(id, data) {
  return window.api.updateEvent(id, data)
}

export function deleteEvent(id) {
  return window.api.deleteEvent(id)
}

export function celebrate(id) {
  return window.api.celebrate(id)
}

export function closeWindow() {
  return window.api.closeWindow()
}

export function minimizeWindow() {
  return window.api.minimizeWindow()
}

export function openWidget(id) {
  return window.api.openWidget(id)
}

export function closeWidget(id) {
  return window.api.closeWidget(id)
}

export function getSetting(key) {
  return window.api.getSetting(key)
}

export function setSetting(key, value) {
  return window.api.setSetting(key, value)
}

export function listWidgets() {
  return window.api.listWidgets()
}
