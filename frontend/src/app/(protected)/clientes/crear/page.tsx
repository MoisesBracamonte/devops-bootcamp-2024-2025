'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const clienteInicial = {
  id: '1',
  nombre: 'Juan Pérez',
  email: 'juan.perez@example.com',
  telefono: '+1 234 567 8900',
  direccion: 'Calle Principal 123, Ciudad',
  serviciosRealizados: 15,
  ingresosTotales: 5000,
  epicrisis: '<p>El paciente presenta...</p>'
}

export default function DetalleCliente() {
  const [cliente, setCliente] = useState(clienteInicial)
  const [editandoEpicrisis, setEditandoEpicrisis] = useState(false)
  const [editandoDetalles, setEditandoDetalles] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: cliente.epicrisis,
    editable: editandoEpicrisis,
  })

  const guardarEpicrisis = () => {
    if (editor) {
      setCliente({ ...cliente, epicrisis: editor.getHTML() })
      setEditandoEpicrisis(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCliente({ ...cliente, [name]: value })
  }

  const guardarDetalles = () => {
    setEditandoDetalles(false)
    // Aquí iría la lógica para guardar los cambios en el servidor
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalle del Cliente</h1>
      
      <div className="grid grid-cols-1  gap-">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Crear Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${cliente.nombre}`} />
                    <AvatarFallback>{cliente.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={cliente.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={cliente.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={cliente.direccion}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}