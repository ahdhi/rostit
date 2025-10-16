"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getResidentTasks, getCurrentWeek } from "@/lib/roster-engine"
import { RESIDENTS, CLEANING_AREAS } from "@/lib/types"
import { CheckCircle2, Users, ListTodo } from "lucide-react"

export function MyTasks() {
  const [selectedResident, setSelectedResident] = useState(RESIDENTS[0].name)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  const currentWeek = getCurrentWeek()
  const tasks = getResidentTasks(selectedResident)

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const getTaskDetails = (areaName: string) => {
    return CLEANING_AREAS.find((a) => a.name === areaName)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground">View and manage your cleaning duties</p>
        </div>
        <Select value={selectedResident} onValueChange={setSelectedResident}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESIDENTS.map((resident) => (
              <SelectItem key={resident.id} value={resident.name}>
                {resident.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No tasks this week!</p>
            <p className="text-sm text-muted-foreground">Enjoy your break</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task, index) => {
            const areaDetails = getTaskDetails(task.area)
            const isHelper = task.isHelper

            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {task.area}
                        {isHelper && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            Helper Role
                          </Badge>
                        )}
                      </CardTitle>
                      {task.partner && task.partner.length > 0 && (
                        <CardDescription className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Working with: {task.partner.join(", ")}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isHelper ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Support the kitchen cleaner or solo area cleaner for 15-20 minutes
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id={`helper-${index}`}
                          checked={completedTasks.has(`helper-${index}`)}
                          onCheckedChange={() => toggleTask(`helper-${index}`)}
                        />
                        <label
                          htmlFor={`helper-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as completed
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ListTodo className="w-4 h-4" />
                        {areaDetails?.tasks.length} tasks to complete
                      </div>
                      <div className="space-y-2">
                        {areaDetails?.tasks.map((taskItem, taskIndex) => {
                          const taskId = `${task.area}-${taskIndex}`
                          return (
                            <div key={taskIndex} className="flex items-center gap-2">
                              <Checkbox
                                id={taskId}
                                checked={completedTasks.has(taskId)}
                                onCheckedChange={() => toggleTask(taskId)}
                              />
                              <label
                                htmlFor={taskId}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {taskItem}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="flex justify-end">
          <Button size="lg" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Submit Completion
          </Button>
        </div>
      )}
    </div>
  )
}
