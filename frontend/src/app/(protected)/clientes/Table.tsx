'use client'

import React, { useMemo, useState } from 'react'
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { IServiceExtended } from '@/interfaces/services.interface'
import { formatDistanceToNow, parseISO } from 'date-fns'


export default function ListServices({services}:{ services: IServiceExtended[] }) {

  console.log(services);
  const columns = useMemo<MRT_ColumnDef<IServiceExtended>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'email',
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
      },
      {
        accessorKey: 'created_at',
        header: 'Creado',
        Cell: ({ cell }) => {
          const parse = parseISO(cell.getValue<string>());
          const _d = formatDistanceToNow(parse,{ addSuffix: true });
          return (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold`}>
                {_d}
              </span>
          )
        }
      },
    ],
    [],
  )

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: 'hsl(222.2, 47.4%, 11.2%)', // Basado en el color primario de shadcn/ui
      },
      background: {
        default: 'hsl(0, 0%, 100%)',
      },
    },
    typography: {
      fontFamily: 'var(--font-sans)', // Usar la fuente de shadcn/ui
    },
  })

  return (
    <ThemeProvider theme={theme}>
          <MaterialReactTable
            columns={columns}
            data={services}
            enableColumnOrdering
            enableGlobalFilter
            enablePagination
            enableSorting
            initialState={{
              pagination: { pageSize: 5, pageIndex: 0 },
              density: 'compact',
            }}
            muiTableBodyCellProps={{
              sx: { fontSize: '0.875rem' },
            }}
            muiTableHeadCellProps={{
              sx: { fontSize: '0.875rem', fontWeight: 'bold' },
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                borderRadius: '0.5rem',
                border: '0px solid hsl(214.3, 31.8%, 91.4%)',
              },
            }}
            renderTopToolbarCustomActions={() => (
              <div className="text-sm text-gray-500">
                Total de servicios: {services.length}
              </div>
            )}
          />
    </ThemeProvider>
  )
}