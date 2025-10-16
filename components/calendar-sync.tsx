"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarService } from "@/lib/calendar-service"
import { ROSTER_CYCLE, RESIDENTS } from "@/lib/types"
import { Calendar, Download, ExternalLink, Check, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getNextDuty } from "@/lib/roster-engine"

export function CalendarSync() {
  const [selectedResident, setSelectedResident] = useState("1")
  const [synced, setSynced] = useState(false)
  const [nextDuty, setNextDuty] = useState<{
    date: Date
    week: number
    tasks: { area: string; isHelper: boolean; partner?: string[] }[]
  } | null>(null)

  useEffect(() => {
    const resident = RESIDENTS.find((r) => r.id === selectedResident)
    if (resident) {
      const duty = getNextDuty(resident.name)
      setNextDuty(duty)
    }
  }, [selectedResident])

  const handleGoogleCalendarSync = () => {
    const resident = RESIDENTS.find((r) => r.id === selectedResident)
    if (!resident) return

    const startDate = nextDuty?.date || new Date()
    startDate.setHours(0, 0, 0, 0)

    const events = CalendarService.syncResidentTasks(resident.name, ROSTER_CYCLE, startDate)

    // Open Google Calendar for each event
    events.then((eventList) => {
      if (eventList.length > 0) {
        // Open first event, user can add others manually
        window.open(eventList[0].googleUrl, "_blank")
        setSynced(true)
        setTimeout(() => setSynced(false), 3000)
      }
    })
  }

  const handleAppleCalendarSync = () => {
    const resident = RESIDENTS.find((r) => r.id === selectedResident)
    if (!resident) return

    const startDate = nextDuty?.date || new Date()
    startDate.setHours(0, 0, 0, 0)

    const events = CalendarService.syncResidentTasks(resident.name, ROSTER_CYCLE, startDate)

    // Download iCal file with all events
    events.then((eventList) => {
      if (eventList.length > 0) {
        // Combine all events into one iCal file
        const allEvents = eventList.map((e) => e.icalContent).join("\n")
        CalendarService.downloadICalFile(allEvents, `cleaning-roster-${resident.name.toLowerCase()}.ics`)
        setSynced(true)
        setTimeout(() => setSynced(false), 3000)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>Sync your cleaning schedule with your favorite calendar app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resident-select">Select Resident</Label>
            <Select value={selectedResident} onValueChange={setSelectedResident}>
              <SelectTrigger id="resident-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESIDENTS.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name} ({resident.room})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {nextDuty && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Next Duty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {nextDuty.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-muted-foreground">(Week {nextDuty.week})</span>
                </div>
                <div className="space-y-2">
                  {nextDuty.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <div>
                        <span className="font-medium">{task.area}</span>
                        {task.partner && task.partner.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Users className="w-3 h-3" />
                            <span>with {task.partner.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleGoogleCalendarSync}
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
            >
              <Calendar className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="font-medium">Google Calendar</div>
                <div className="text-xs text-muted-foreground">Add events to Google Calendar</div>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleAppleCalendarSync}
              className="w-full justify-start gap-3 bg-transparent"
              variant="outline"
            >
              <Calendar className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="font-medium">Apple Calendar</div>
                <div className="text-xs text-muted-foreground">Download .ics file for Apple Calendar</div>
              </div>
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {synced && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 p-3 rounded-lg">
              <Check className="w-4 h-4" />
              Calendar events created successfully!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Google Calendar:</strong> Opens Google Calendar in a new tab with your
            cleaning tasks pre-filled. You can review and add them to your calendar.
          </p>
          <p>
            <strong className="text-foreground">Apple Calendar:</strong> Downloads an .ics file containing all your
            cleaning tasks for the 4-week cycle. Double-click the file to import into Apple Calendar, Outlook, or any
            calendar app.
          </p>
          <p className="text-xs">
            Note: Events are created starting from your next duty date for the 4-week cycle. You'll need to re-sync when
            the cycle repeats.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
