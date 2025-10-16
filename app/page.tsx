import { WeekOverview } from "@/components/week-overview"
import { MyTasks } from "@/components/my-tasks"
import { AIAssistant } from "@/components/ai-assistant"
import { NotificationSettings } from "@/components/notification-settings"
import { CalendarSync } from "@/components/calendar-sync"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, ListChecks, MessageSquare, Bell, Calendar } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">House Cleaning Roster</h1>
              <p className="text-muted-foreground mt-1">14 Moona St</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">My Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <WeekOverview />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <MyTasks />
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <div className="max-w-3xl mx-auto">
              <AIAssistant />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <NotificationSettings />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <CalendarSync />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
