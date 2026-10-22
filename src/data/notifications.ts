export async function requestNotifications() {
  if (!('Notification' in window)) return { supported: false, permission: 'unsupported' as const }
  const permission = await Notification.requestPermission()
  return { supported: true, permission }
}

export function scheduleNotification(title: string, triggerAt: number) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false
  const delay = Math.max(0, triggerAt - Date.now())
  window.setTimeout(() => new Notification(title), delay)
  return true
}
