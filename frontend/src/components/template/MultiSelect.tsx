'use client';
import React, { forwardRef } from 'react'
import Select,{ Props as SelectProps } from 'react-select'
import { cn } from "@/lib/utils"

export type MultiSelectProps = SelectProps & {
  label?: string
}

const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <Select
          {...props}
          ref={ref as any}
          className={cn(
            "react-select-container",
            className
          )}
          classNamePrefix="react-select"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              outline: state.isFocused ? 'none' : 'none',
              boxShadow: state.isFocused ? 'none': 'none',
              borderColor: state.isFocused ? 'dark' : 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--background))',
              '&:hover': {
                borderColor: 'hsl(var(--ring))'
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--background))',
              color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))',
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'hsl(var(--accent))',
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: 'hsl(var(--accent-foreground))',
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              color: 'hsl(var(--accent-foreground))',
              ':hover': {
                backgroundColor: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
              },
            }),
          }}
        />
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }

