import { ROSTER_CYCLE, type WeeklyAssignment } from "./types"

export function getCurrentWeek(): number {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000
  const weekOfYear = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)

  // Calculate current week in 4-week cycle
  return ((weekOfYear - 1) % 4) + 1
}

export function getWeekAssignment(week: number): WeeklyAssignment {
  const cycleWeek = ((week - 1) % 4) + 1
  return ROSTER_CYCLE[cycleWeek - 1]
}

export function getCurrentAssignment(): WeeklyAssignment {
  return getWeekAssignment(getCurrentWeek())
}

export function getNextWeekAssignment(): WeeklyAssignment {
  const currentWeek = getCurrentWeek()
  const nextWeek = currentWeek === 4 ? 1 : currentWeek + 1
  return getWeekAssignment(nextWeek)
}

export function getResidentTasks(
  residentName: string,
  week?: number,
): {
  area: string
  isHelper: boolean
  partner?: string[]
}[] {
  const assignment = week ? getWeekAssignment(week) : getCurrentAssignment()
  const tasks: { area: string; isHelper: boolean; partner?: string[] }[] = []

  if (assignment.livingRoom.includes(residentName)) {
    tasks.push({
      area: "Living Room",
      isHelper: false,
      partner: assignment.livingRoom.filter((n) => n !== residentName),
    })
  }

  if (assignment.kitchen.includes(residentName)) {
    tasks.push({
      area: "Kitchen",
      isHelper: false,
      partner: assignment.kitchen.filter((n) => n !== residentName),
    })
  }

  if (assignment.toilet1.includes(residentName)) {
    tasks.push({
      area: "Toilet 1",
      isHelper: false,
      partner: assignment.toilet1.filter((n) => n !== residentName),
    })
  }

  if (assignment.bathroom.includes(residentName)) {
    tasks.push({
      area: "Bathroom",
      isHelper: false,
      partner: assignment.bathroom.filter((n) => n !== residentName),
    })
  }

  if (assignment.helper === residentName) {
    tasks.push({
      area: "Helper",
      isHelper: true,
    })
  }

  return tasks
}

export function getNextDuty(residentName: string): {
  date: Date
  week: number
  tasks: { area: string; isHelper: boolean; partner?: string[] }[]
} | null {
  const currentWeek = getCurrentWeek()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check current week first
  const currentTasks = getResidentTasks(residentName, currentWeek)
  if (currentTasks.length > 0) {
    // Get the start of current week (Monday)
    const dayOfWeek = today.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 1 - dayOfWeek
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() + daysUntilMonday)

    // If we're still in the current week, return current week's duty
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)

    if (today <= weekEnd) {
      return {
        date: currentWeekStart,
        week: currentWeek,
        tasks: currentTasks,
      }
    }
  }

  // Check next 4 weeks to find next duty
  for (let i = 1; i <= 4; i++) {
    const checkWeek = ((currentWeek - 1 + i) % 4) + 1
    const tasks = getResidentTasks(residentName, checkWeek)

    if (tasks.length > 0) {
      // Calculate the date for this week
      const weeksAhead = i
      const nextDutyDate = new Date(today)
      const dayOfWeek = today.getDay()
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 1 - dayOfWeek
      nextDutyDate.setDate(today.getDate() + daysUntilMonday + weeksAhead * 7)

      return {
        date: nextDutyDate,
        week: checkWeek,
        tasks,
      }
    }
  }

  return null
}
