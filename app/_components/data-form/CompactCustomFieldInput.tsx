import { NumberInput } from "@/components/shared/number-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomField, isAdvancedField } from "@/lib/types/customField"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"

interface CompactCustomFieldProps {
    field: CustomField
    error?: string
    onChange: (value: string | number) => void
    onRemove: () => void
    isOriginal: boolean
   }
   
   export function CompactCustomField({
    field,
    error,
    onChange,
    onRemove,
    isOriginal
  }: CompactCustomFieldProps) {
    const [localError, setLocalError] = useState<string>('')
    const isAdvanced = isAdvancedField(field.type)
  
    useEffect(() => {
      if (error) {
        setLocalError(error)
      } else {
        setLocalError('')
      }
    }, [error])
  
    const handleChange = useCallback((newValue: string | number) => {
      onChange(newValue)
      setLocalError('')
    }, [onChange])
  
    const renderInput = () => {
      const baseClasses = cn(
        "h-8",
        localError && "border-red-400/50",
      )
  
      if (isAdvanced) {
        return (
          <div className="relative flex-1">
            <Input disabled value={field.value || ''} className="bg-muted/50" />
            <Badge variant="secondary" className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-[10px]">
              Enterprise
            </Badge>
          </div>
        )
      }
  
      switch (field.type) {
        case 'text':
        case 'email':
          return (
            <Input
              type={field.type}
              value={field.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              className={baseClasses}
            />
          )
        case 'number':
          return (
            <NumberInput
              value={field.value as number | undefined}
              onChange={(value) => handleChange(value ?? '')}
              min={0}
              allowFloat={false}
              className={baseClasses}
            />
          )
        case 'currency':
          return (
            <NumberInput
              value={field.value as number | undefined}
              onChange={(value) => handleChange(value ?? '')}
              min={0}
              allowFloat={true}
              decimalPlaces={2}
              prefix="$"
              thousandSeparator={true}
              className={baseClasses}
            />
          )
        default:
          return <Input disabled value="Unsupported type" className="bg-muted/50" />
      }
    }
  
    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
        <span className="text-sm font-medium min-w-[100px] flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-red-400/80">*</span>}
        </span>
        {renderInput()}
        {!isOriginal && (
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2"
          >
            ×
          </Button>
        )}
        {localError && (
          <p className="text-[13px] text-red-400/90">{localError}</p>
        )}
      </div>
    )
  }