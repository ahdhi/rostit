export interface Resident {
  id: string
  name: string
  room: string
  roommate?: string
}

export interface CleaningArea {
  id: string
  name: string
  tasks: string[]
}

export interface WeeklyAssignment {
  week: number
  livingRoom: string[]
  kitchen: string[]
  toilet1: string[]
  bathroom: string[]
  helper: string
}

export interface TaskCompletion {
  id: string
  week: number
  area: string
  residentId: string
  completed: boolean
  completedAt?: Date
}

export interface NotificationPreferences {
  residentId: string
  pushEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  telegramEnabled: boolean
  whatsappEnabled: boolean
  reminderTime: string // e.g., "09:00"
  reminderDays: number // days before task due
}

export interface CalendarSync {
  residentId: string
  provider: "google" | "apple"
  enabled: boolean
  calendarId?: string
  lastSync?: Date
}

export interface Notification {
  id: string
  residentId: string
  type: "task_reminder" | "task_due" | "swap_request" | "swap_approved"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export const RESIDENTS: Resident[] = [
  { id: "1", name: "Arron", room: "Room 1", roommate: "Ashwin" },
  { id: "2", name: "Ashwin", room: "Room 1", roommate: "Arron" },
  { id: "3", name: "Adhi", room: "Room 2", roommate: "Roshna" },
  { id: "4", name: "Roshna", room: "Room 2", roommate: "Adhi" },
  { id: "5", name: "Eric", room: "Room 3", roommate: "Vyshnavi" },
  { id: "6", name: "Vyshnavi", room: "Room 3", roommate: "Eric" },
  { id: "7", name: "Albert", room: "Room 4" },
]

export const CLEANING_AREAS: CleaningArea[] = [
  {
    id: "living-room",
    name: "Living Room",
    tasks: ["Dust furniture", "Vacuum floor", "Tidy up space"],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    tasks: ["Clean stove", "Clean oven", "Clean fridge", "Take out waste", "Mop floor"],
  },
  {
    id: "toilet-1",
    name: "Toilet 1",
    tasks: ["Clean closet", "Clean mirror", "Mop floor"],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    tasks: ["Clean basin", "Clean shower", "Clean tub", "Wash mat", "Restock paper"],
  },
]

export const ROSTER_CYCLE: WeeklyAssignment[] = [
  {
    week: 1,
    livingRoom: ["Adhi", "Roshna"],
    kitchen: ["Arron", "Ashwin"],
    toilet1: ["Eric", "Vyshnavi"],
    bathroom: ["Albert"],
    helper: "Adhi",
  },
  {
    week: 2,
    livingRoom: ["Eric", "Vyshnavi"],
    kitchen: ["Albert"],
    toilet1: ["Arron", "Ashwin"],
    bathroom: ["Adhi", "Roshna"],
    helper: "Vyshnavi",
  },
  {
    week: 3,
    livingRoom: ["Albert"],
    kitchen: ["Eric", "Vyshnavi"],
    toilet1: ["Adhi", "Roshna"],
    bathroom: ["Arron", "Ashwin"],
    helper: "Ashwin",
  },
  {
    week: 4,
    livingRoom: ["Arron", "Ashwin"],
    kitchen: ["Adhi", "Roshna"],
    toilet1: ["Albert"],
    bathroom: ["Eric", "Vyshnavi"],
    helper: "Roshna",
  },
]
