import type { NotificationPreferences } from "./types"

export class NotificationService {
  // Request browser notification permission
  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("[v0] Browser notifications not supported")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  // Send browser push notification
  static async sendPushNotification(title: string, message: string, icon?: string) {
    const hasPermission = await this.requestPermission()

    if (!hasPermission) {
      console.log("[v0] Notification permission denied")
      return
    }

    const notification = new Notification(title, {
      body: message,
      icon: icon || "/icon.png",
      badge: "/badge.png",
      tag: "cleaning-roster",
      requireInteraction: false,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return notification
  }

  // Schedule notification for task reminder
  static scheduleTaskReminder(residentName: string, area: string, dueDate: Date, preferences: NotificationPreferences) {
    const now = new Date()
    const reminderDate = new Date(dueDate)
    reminderDate.setDate(reminderDate.getDate() - preferences.reminderDays)

    const [hours, minutes] = preferences.reminderTime.split(":")
    reminderDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    const timeUntilReminder = reminderDate.getTime() - now.getTime()

    if (timeUntilReminder > 0 && preferences.pushEnabled) {
      setTimeout(() => {
        this.sendPushNotification(
          "Cleaning Task Reminder",
          `${residentName}, you have ${area} cleaning due in ${preferences.reminderDays} days!`,
        )
      }, timeUntilReminder)
    }
  }

  // Send notification via API (for email, SMS, etc.)
  static async sendNotification(
    residentId: string,
    type: string,
    title: string,
    message: string,
    preferences: NotificationPreferences,
  ) {
    const channels = []

    if (preferences.pushEnabled) {
      await this.sendPushNotification(title, message)
      channels.push("push")
    }

    // For premium channels, make API call
    if (
      preferences.emailEnabled ||
      preferences.smsEnabled ||
      preferences.telegramEnabled ||
      preferences.whatsappEnabled
    ) {
      try {
        const response = await fetch("/api/notifications/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            residentId,
            type,
            title,
            message,
            channels: {
              email: preferences.emailEnabled,
              sms: preferences.smsEnabled,
              telegram: preferences.telegramEnabled,
              whatsapp: preferences.whatsappEnabled,
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          channels.push(...data.sentChannels)
        }
      } catch (error) {
        console.error("[v0] Failed to send notification:", error)
      }
    }

    return channels
  }
}
