'use client'
import { useState, useEffect, useCallback } from 'react'
import { CustomField, isAdvancedField } from '@/lib/types/customField'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Switch } from "@/components/ui/switch"
import { NumberInput } from '@/components/shared/number-input'

interface CustomFieldInputProps {
  field: CustomField
  onChange: (value: string | number) => void
  onRequiredChange?: (required: boolean) => void
  error?: string
  disabled?: boolean
}

export function CustomFieldInput({
  field,
  onChange,
  onRequiredChange,
  error,
  disabled
}: CustomFieldInputProps) {
  const [localError, setLocalError] = useState<string>('')
  const isAdvanced = isAdvancedField(field.type)

  // Validate value based on field type
  // Show error state immediately for required fields
  useEffect(() => {
    if (error) {
      setLocalError(error)
    } else {
      setLocalError('') // Clear local error when error prop is removed
    }
  }, [error])



  const handleChange = useCallback((newValue: string | number) => {
    onChange(newValue)
    setLocalError('')
  }, [onChange])

  const renderFieldInput = () => {
    const baseInputClasses = cn(
      "h-8",
      localError && "border-red-400/50 focus:ring-red-400/30",
      disabled && "opacity-50",
      "transition-colors"
    )
  
    if (isAdvanced) {
      return (
        <div className="relative">
          <Input
            disabled
            value={field.value || ''}
            className={cn(baseInputClasses, "bg-muted/50")}
          />
          <Badge 
            variant="secondary" 
            className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-[10px] font-normal"
          >
            Enterprise
          </Badge>
        </div>
      )
    }
  
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            data-testid={`custom-field-${field.id}-value`} 
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={baseInputClasses}
            disabled={disabled}
            placeholder={field.label ? `Enter ${field.label.toLowerCase()}` : 'Enter text'}
          />
        )
  
      case 'email':
        return (
          <Input
            type="email"
            data-testid={`custom-field-${field.id}-value`} 
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={baseInputClasses}
            disabled={disabled}
            placeholder="Enter email"
          />
        )
  
        case 'number':
            return (
              <NumberInput
                value={field.value as number | undefined}
                onChange={(newValue: number | undefined) => {
                  handleChange(newValue ?? '')  // Convert undefined to empty string
                }}
                data-testid={`custom-field-${field.id}-value`} 
                min={0}
                allowFloat={false}
                className={cn(localError && "border-red-400/50")}
                disabled={disabled}
              />
            )
          
          case 'currency':
            return (
              <NumberInput
                value={field.value as number | undefined}
                onChange={(newValue: number | undefined) => {
                  handleChange(newValue ?? '')
                }}
                data-testid={`custom-field-${field.id}-value`} 
                min={0}
                allowFloat={true}
                decimalPlaces={2}
                prefix="$"
                thousandSeparator={true}
                className={cn(localError && "border-red-400/50")}
                disabled={disabled}
              />
            )
      default:
        return (
          <Input 
            disabled 
            data-testid={`custom-field-${field.id}-value`} 
            value="Unsupported field type" 
            className={cn(baseInputClasses, "bg-muted/50")}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
     {
        field.label?

     
      <Label className="text-sm font-medium ">
          {field.label}
          {field.required && (
            <span data-testid='required-asteric' className="ml-1 text-red-400/80">*</span>
          )}
        </Label>

        :

        <Label className="text-sm font-medium text-red-400/80">
          Field Label Required
        </Label>
        }
        <div className="flex items-center gap-2">
          {isAdvanced && (
            <Badge variant="outline" className="text-muted-foreground">
              Advanced Field
            </Badge>
          )}
          {onRequiredChange && (
            <div className="flex items-center gap-2">
              {/* <Label htmlFor={`${field.id}-required`} className="text-sm">Required</Label> */}
              <Switch
                id={`${field.id}-required`}
                data-testid={`custom-field-${field.id}-required`}
                checked={field.required}
                onCheckedChange={onRequiredChange}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
      {renderFieldInput()}
      <div className="min-h-[20px]">
      {localError && (
        <p className="text-[13px] font-medium text-red-400/90">{localError}</p>
      )}
      </div>
    </div>
  )
}


interface FieldTypeSelectorProps {
  value: CustomField['type']
  onChange: (value: CustomField['type']) => void
  disabled?: boolean
}

export function FieldTypeSelector({ 
    value, 
    onChange,
    disabled 
  }: FieldTypeSelectorProps) {
    return (
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="currency">Currency</SelectItem>
          <SelectItem value="file" disabled>File Upload</SelectItem>
          <SelectItem value="date" disabled>Date/Time</SelectItem>
          <SelectItem value="location" disabled>Location</SelectItem>
        </SelectContent>
      </Select>
    )
  }