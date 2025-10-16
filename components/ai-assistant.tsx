"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Bot, User } from "lucide-react"
import { getCurrentWeek, getCurrentAssignment, getNextWeekAssignment, getResidentTasks } from "@/lib/roster-engine"
import { RESIDENTS } from "@/lib/types"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        'Hi! I can help you with cleaning roster questions. Try asking "Who is cleaning the kitchen this week?" or "What are my tasks?"',
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Simulate AI response (in production, this would call the AI API)
    setTimeout(() => {
      const response = generateResponse(userMessage)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1000)
  }

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    const currentWeek = getCurrentWeek()
    const currentAssignment = getCurrentAssignment()
    const nextAssignment = getNextWeekAssignment()
    const nextWeek = currentWeek === 4 ? 1 : currentWeek + 1

    // Check for specific resident queries
    const residentMatch = RESIDENTS.find((r) => lowerQuery.includes(r.name.toLowerCase()))
    if (residentMatch && (lowerQuery.includes("my") || lowerQuery.includes("task") || lowerQuery.includes("duties"))) {
      const tasks = getResidentTasks(residentMatch.name)
      if (tasks.length === 0) {
        return `${residentMatch.name} has no cleaning assignments this week (Week ${currentWeek}). Enjoy your break! 🎉`
      }
      const taskDescriptions = tasks
        .map((t) => {
          if (t.isHelper) {
            return "Helper (support kitchen/solo cleaner for 15-20 minutes)"
          }
          if (t.partner && t.partner.length > 0) {
            return `${t.area} (with ${t.partner.join(" & ")})`
          }
          return `${t.area} (solo)`
        })
        .join(", ")
      return `This week (Week ${currentWeek}), ${residentMatch.name}'s assignments are: ${taskDescriptions}.`
    }

    // Area-specific queries
    if (lowerQuery.includes("kitchen")) {
      if (lowerQuery.includes("next week")) {
        const people = nextAssignment.kitchen.join(" & ")
        return `Next week (Week ${nextWeek}), ${people} will be cleaning the Kitchen.`
      }
      const people = currentAssignment.kitchen.join(" & ")
      return `This week (Week ${currentWeek}), ${people} ${currentAssignment.kitchen.length === 1 ? "is" : "are"} cleaning the Kitchen.`
    }

    if (lowerQuery.includes("bathroom")) {
      if (lowerQuery.includes("next week")) {
        const people = nextAssignment.bathroom.join(" & ")
        return `Next week (Week ${nextWeek}), ${people} will be cleaning the Bathroom.`
      }
      const people = currentAssignment.bathroom.join(" & ")
      return `This week (Week ${currentWeek}), ${people} ${currentAssignment.bathroom.length === 1 ? "is" : "are"} cleaning the Bathroom.`
    }

    if (lowerQuery.includes("living room") || lowerQuery.includes("living")) {
      if (lowerQuery.includes("next week")) {
        const people = nextAssignment.livingRoom.join(" & ")
        return `Next week (Week ${nextWeek}), ${people} will be cleaning the Living Room.`
      }
      const people = currentAssignment.livingRoom.join(" & ")
      return `This week (Week ${currentWeek}), ${people} ${currentAssignment.livingRoom.length === 1 ? "is" : "are"} cleaning the Living Room.`
    }

    if (lowerQuery.includes("toilet")) {
      if (lowerQuery.includes("next week")) {
        const people = nextAssignment.toilet1.join(" & ")
        return `Next week (Week ${nextWeek}), ${people} will be cleaning Toilet 1.`
      }
      const people = currentAssignment.toilet1.join(" & ")
      return `This week (Week ${currentWeek}), ${people} ${currentAssignment.toilet1.length === 1 ? "is" : "are"} cleaning Toilet 1.`
    }

    // Helper queries
    if (lowerQuery.includes("helper")) {
      if (lowerQuery.includes("next week")) {
        return `Next week (Week ${nextWeek}), ${nextAssignment.helper} will be the helper. They should support the kitchen or solo cleaner for 15-20 minutes.`
      }
      return `This week (Week ${currentWeek}), ${currentAssignment.helper} is the helper. They should support the kitchen or solo cleaner for 15-20 minutes.`
    }

    // Week queries
    if (lowerQuery.includes("what week") || lowerQuery.includes("current week") || lowerQuery.includes("which week")) {
      return `We are currently in Week ${currentWeek} of the 4-week cleaning roster cycle.`
    }

    // Next week overview
    if (lowerQuery.includes("next week")) {
      return `Next week (Week ${nextWeek}): Living Room - ${nextAssignment.livingRoom.join(" & ")}, Kitchen - ${nextAssignment.kitchen.join(" & ")}, Toilet 1 - ${nextAssignment.toilet1.join(" & ")}, Bathroom - ${nextAssignment.bathroom.join(" & ")}, Helper - ${nextAssignment.helper}.`
    }

    // Current week overview
    if (lowerQuery.includes("this week") || lowerQuery.includes("current") || lowerQuery.includes("now")) {
      return `This week (Week ${currentWeek}): Living Room - ${currentAssignment.livingRoom.join(" & ")}, Kitchen - ${currentAssignment.kitchen.join(" & ")}, Toilet 1 - ${currentAssignment.toilet1.join(" & ")}, Bathroom - ${currentAssignment.bathroom.join(" & ")}, Helper - ${currentAssignment.helper}.`
    }

    // Default response
    return `I can help you with:\n• Current week's assignments\n• Next week's preview\n• Specific area assignments (kitchen, bathroom, living room, toilet)\n• Individual resident tasks\n• Helper information\n\nTry asking "What are my tasks?" or "Who is cleaning the kitchen?"`
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Ammavan
        </CardTitle>
        <CardDescription>Endha makkale?</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ask about cleaning duties..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
