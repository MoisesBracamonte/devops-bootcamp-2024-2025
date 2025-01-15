'use client'

import React, { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Ejemplo de eventos
const events = [
  {
    title: 'Reunión de equipo',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 30),
  },
  {
    title: 'Almuerzo con cliente',
    start: new Date(2024, 0, 16, 12, 0),
    end: new Date(2024, 0, 16, 13, 30),
  },
]

export default function CalendarPage() {
  const [myEvents, setMyEvents] = useState(events)
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: '', start, end })
    setIsDialogOpen(true)
  }

  const handleAddEvent = () => {
    if (newEvent.title) {
      setMyEvents([...myEvents, newEvent])
      setIsDialogOpen(false)
      setNewEvent({ title: '', start: '', end: '' })
    }
  }

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Calendario de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={myEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            className="rounded-md border border-input bg-background text-foreground"
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Evento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Inicio
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={newEvent.start instanceof Date ? newEvent.start.toISOString().slice(0, 16) : newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                Fin
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={newEvent.end instanceof Date ? newEvent.end.toISOString().slice(0, 16) : newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddEvent}>Agregar Evento</Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .rbc-calendar {
          font-family: var(--font-sans);
          border:none
        }
        .rbc-header {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 8px;
        }
        .rbc-event {
          background-color: hsl(var(--primary));
          border-color: hsl(var(--primary));
        }
        .rbc-today {
          background-color: hsl(var(--accent) / 0.1);
        }
        .rbc-off-range-bg {
          background-color: hsl(var(--muted));
        }
        .rbc-button-link {
          color: hsl(var(--foreground));
        }
      `}</style>
    </>
  )
}