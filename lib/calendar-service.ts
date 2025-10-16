import type { WeeklyAssignment } from "./types"

export class CalendarService {
  // Generate Google Calendar event URL
  static generateGoogleCalendarUrl(title: string, description: string, startDate: Date, endDate: Date): string {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details: description,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Generate iCal format for Apple Calendar
  static generateICalEvent(title: string, description: string, startDate: Date, endDate: Date): string {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cleaning Roster//EN
BEGIN:VEVENT
UID:${Date.now()}@cleaningroster.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`
  }

  // Download iCal file
  static downloadICalFile(icalContent: string, filename: string) {
    const blob = new Blob([icalContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Create cleaning task event
  static createCleaningEvent(residentName: string, area: string, tasks: string[], weekNumber: number, startDate: Date) {
    const title = `Cleaning: ${area}`
    const description = `Assigned to: ${residentName}\n\nTasks:\n${tasks.map((t) => `- ${t}`).join("\n")}\n\nWeek ${weekNumber} of 4-week cycle`

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7) // Week-long task

    return {
      title,
      description,
      startDate,
      endDate,
      googleUrl: this.generateGoogleCalendarUrl(title, description, startDate, endDate),
      icalContent: this.generateICalEvent(title, description, startDate, endDate),
    }
  }

  // Sync all tasks for a resident
  static async syncResidentTasks(residentName: string, assignments: WeeklyAssignment[], startDate: Date) {
    const events = []

    assignments.forEach((assignment, index) => {
      const weekStart = new Date(startDate)
      weekStart.setDate(weekStart.getDate() + index * 7)

      // Check each area for this resident
      if (assignment.livingRoom.includes(residentName)) {
        events.push(
          this.createCleaningEvent(
            residentName,
            "Living Room",
            ["Dust furniture", "Vacuum floor", "Tidy up space"],
            assignment.week,
            weekStart,
          ),
        )
      }
      if (assignment.kitchen.includes(residentName)) {
        events.push(
          this.createCleaningEvent(
            residentName,
            "Kitchen",
            ["Clean stove", "Clean oven", "Clean fridge", "Take out waste", "Mop floor"],
            assignment.week,
            weekStart,
          ),
        )
      }
      if (assignment.toilet1.includes(residentName)) {
        events.push(
          this.createCleaningEvent(
            residentName,
            "Toilet 1",
            ["Clean closet", "Clean mirror", "Mop floor"],
            assignment.week,
            weekStart,
          ),
        )
      }
      if (assignment.bathroom.includes(residentName)) {
        events.push(
          this.createCleaningEvent(
            residentName,
            "Bathroom",
            ["Clean basin", "Clean shower", "Clean tub", "Wash mat", "Restock paper"],
            assignment.week,
            weekStart,
          ),
        )
      }
    })

    return events
  }
}
