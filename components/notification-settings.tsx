"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NotificationService } from "@/lib/notification-service"
import { Bell, Mail, MessageSquare, Phone, Check } from "lucide-react"
import type { NotificationPreferences } from "@/lib/types"

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    residentId: "1",
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    telegramEnabled: false,
    whatsappEnabled: false,
    reminderTime: "09:00",
    reminderDays: 2,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    // Request push notification permission if enabled
    if (preferences.pushEnabled) {
      await NotificationService.requestPermission()
    }

    // Save preferences (in real app, would save to database)
    console.log("[v0] Saving notification preferences:", preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestNotification = async () => {
    await NotificationService.sendPushNotification(
      "Test Notification",
      "This is a test notification from your cleaning roster app!",
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive cleaning reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="push" className="font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Browser notifications (Free)</p>
              </div>
            </div>
            <Switch
              id="push"
              checked={preferences.pushEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, pushEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <div>
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <p className="text-sm text-muted-foreground">Email notifications (Premium)</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, emailEnabled: checked })}
              disabled
            />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <div>
                <Label htmlFor="sms" className="font-medium">
                  SMS
                </Label>
                <p className="text-sm text-muted-foreground">Text messages (Premium)</p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={preferences.smsEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, smsEnabled: checked })}
              disabled
            />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <div>
                <Label htmlFor="telegram" className="font-medium">
                  Telegram
                </Label>
                <p className="text-sm text-muted-foreground">Telegram messages (Premium)</p>
              </div>
            </div>
            <Switch
              id="telegram"
              checked={preferences.telegramEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, telegramEnabled: checked })}
              disabled
            />
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <div>
                <Label htmlFor="whatsapp" className="font-medium">
                  WhatsApp
                </Label>
                <p className="text-sm text-muted-foreground">WhatsApp messages (Premium)</p>
              </div>
            </div>
            <Switch
              id="whatsapp"
              checked={preferences.whatsappEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, whatsappEnabled: checked })}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
          <CardDescription>Configure when you want to receive reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={preferences.reminderTime}
              onChange={(e) => setPreferences({ ...preferences, reminderTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-days">Remind Me</Label>
            <Select
              value={preferences.reminderDays.toString()}
              onValueChange={(value) => setPreferences({ ...preferences, reminderDays: Number.parseInt(value) })}
            >
              <SelectTrigger id="reminder-days">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="2">2 days before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
        <Button variant="outline" onClick={handleTestNotification}>
          Test Notification
        </Button>
      </div>
    </div>
  )
}
