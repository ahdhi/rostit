"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentWeek, getCurrentAssignment, getNextWeekAssignment, getWeekAssignment } from "@/lib/roster-engine"
import { CLEANING_AREAS, ROSTER_CYCLE } from "@/lib/types"
import { Users, Sparkles, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WeekOverview() {
  const currentWeek = getCurrentWeek()
  const currentAssignment = getCurrentAssignment()
  const nextAssignment = getNextWeekAssignment()

  const getAreaIcon = (areaName: string) => {
    const icons: Record<string, string> = {
      "Living Room": "🛋️",
      Kitchen: "🍳",
      "Toilet 1": "🚽",
      Bathroom: "🚿",
    }
    return icons[areaName] || "🏠"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cleaning Roster</h2>
          <p className="text-muted-foreground">Current and upcoming assignments</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          4-Week Cycle
        </Badge>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="current">Current Week</TabsTrigger>
          <TabsTrigger value="full-cycle" className="gap-2">
            <Calendar className="w-4 h-4" />
            Full Cycle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Week {currentWeek}</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Living Room</CardTitle>
                  <span className="text-2xl">{getAreaIcon("Living Room")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {currentAssignment.livingRoom.map((name) => (
                        <Badge key={name} variant="outline">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CLEANING_AREAS.find((a) => a.name === "Living Room")?.tasks.length} tasks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kitchen</CardTitle>
                  <span className="text-2xl">{getAreaIcon("Kitchen")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {currentAssignment.kitchen.map((name) => (
                        <Badge key={name} variant="outline">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CLEANING_AREAS.find((a) => a.name === "Kitchen")?.tasks.length} tasks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Toilet 1</CardTitle>
                  <span className="text-2xl">{getAreaIcon("Toilet 1")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {currentAssignment.toilet1.map((name) => (
                        <Badge key={name} variant="outline">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CLEANING_AREAS.find((a) => a.name === "Toilet 1")?.tasks.length} tasks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Bathroom</CardTitle>
                  <span className="text-2xl">{getAreaIcon("Bathroom")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {currentAssignment.bathroom.map((name) => (
                        <Badge key={name} variant="outline">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CLEANING_AREAS.find((a) => a.name === "Bathroom")?.tasks.length} tasks
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
                Helper of the Week
              </CardTitle>
              <CardDescription>Supports kitchen/solo cleaner for 15-20 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="text-lg px-4 py-2 bg-accent text-accent-foreground">
                {currentAssignment.helper}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Week Preview</CardTitle>
              <CardDescription>Week {currentWeek === 4 ? 1 : currentWeek + 1} assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Living Room</p>
                  <div className="flex flex-wrap gap-1">
                    {nextAssignment.livingRoom.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kitchen</p>
                  <div className="flex flex-wrap gap-1">
                    {nextAssignment.kitchen.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Toilet 1</p>
                  <div className="flex flex-wrap gap-1">
                    {nextAssignment.toilet1.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bathroom</p>
                  <div className="flex flex-wrap gap-1">
                    {nextAssignment.bathroom.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full-cycle" className="space-y-6">
          <div className="space-y-6">
            {ROSTER_CYCLE.map((weekAssignment, index) => {
              const weekNumber = index + 1
              const isCurrentWeek = weekNumber === currentWeek

              return (
                <Card
                  key={weekNumber}
                  className={isCurrentWeek ? "border-2 border-primary shadow-lg" : ""}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Week {weekNumber}</CardTitle>
                        {isCurrentWeek && (
                          <Badge variant="default" className="mt-2">
                            Current Week
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Helper</div>
                        <Badge variant="outline" className="text-base px-3 py-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {weekAssignment.helper}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getAreaIcon("Living Room")}</span>
                          <h4 className="font-semibold">Living Room</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {weekAssignment.livingRoom.map((name) => (
                            <Badge key={name} variant="secondary">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getAreaIcon("Kitchen")}</span>
                          <h4 className="font-semibold">Kitchen</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {weekAssignment.kitchen.map((name) => (
                            <Badge key={name} variant="secondary">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getAreaIcon("Toilet 1")}</span>
                          <h4 className="font-semibold">Toilet 1</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {weekAssignment.toilet1.map((name) => (
                            <Badge key={name} variant="secondary">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getAreaIcon("Bathroom")}</span>
                          <h4 className="font-semibold">Bathroom</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {weekAssignment.bathroom.map((name) => (
                            <Badge key={name} variant="secondary">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
