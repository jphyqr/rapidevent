'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | undefined
  onChange: (value: number | undefined) => void
  allowFloat?: boolean
  min?: number
  max?: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  thousandSeparator?: boolean
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ 
    value, 
    onChange, 
    allowFloat = false,
    min,
    max,
    prefix,
    suffix,
    decimalPlaces = 2,
 
    className,
    disabled,
    ...props 
  }, ref) => {
    const formatValue = React.useCallback((num: number | undefined): string => {
      if (num === undefined || isNaN(num)) return ''
      return String(num)
    }, [])

    const [displayValue, setDisplayValue] = React.useState(() => formatValue(value))


    React.useEffect(() => {
      setDisplayValue(formatValue(value))
    }, [value, formatValue])

    const parseValue = (str: string): number | undefined => {
      if (!str) return undefined

      const cleaned = str
        .replace(/[^\d.-]/g, '')

      if (allowFloat) {
        const num = parseFloat(cleaned)
        return isNaN(num) ? undefined : num
      } else {
        const num = parseInt(cleaned, 10)
        return isNaN(num) ? undefined : num
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow navigation keys
      if ([
        'ArrowLeft',
        'ArrowRight',
        'Backspace',
        'Delete',
        'Tab',
        'Enter',
        'Home',
        'End',
      ].includes(e.key)) {
        return
      }

      // Allow number keys
      if (e.key >= '0' && e.key <= '9') {
        return
      }

      // Allow decimal point for float values
      if (allowFloat && e.key === '.' && !displayValue.includes('.')) {
        return
      }

      // Allow minus sign at start for negative numbers if min is less than 0
      if (min && min < 0 && e.key === '-' && !displayValue.includes('-') && e.currentTarget.selectionStart === 0) {
        return
      }

      // Prevent all other keys
      e.preventDefault()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      if (!inputValue) {
        setDisplayValue('')
        onChange(undefined)
        return
      }

      setDisplayValue(inputValue)
      const newValue = parseValue(inputValue)
      
      if (newValue !== undefined) {
        if (min !== undefined && newValue < min) return
        if (max !== undefined && newValue > max) return
        onChange(newValue)
      } else {
        onChange(undefined)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
     
      const currentValue = parseValue(displayValue)
      if (currentValue !== undefined && allowFloat) {
        setDisplayValue(currentValue.toFixed(decimalPlaces))
      }
      props.onBlur?.(e)
    }

    return (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          {...props}
          ref={ref}
          type="text"
          data-testid="number-input" // Add this line

          inputMode={allowFloat ? "decimal" : "numeric"}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            prefix && "pl-7",
            suffix && "pr-7",
            className
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    )
  }
)

NumberInput.displayName = "NumberInput"

export { NumberInput }