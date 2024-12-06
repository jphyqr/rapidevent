'use client'
import React, {  useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from "framer-motion"

import { Trash2, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdvancedField, Submission, type CustomField } from '@/lib/types/customField'
import { formSchema, type FormValues } from './schema'
import { createSubmission } from '@/lib/actions'
import { CustomFieldInput, FieldTypeSelector } from './CustomFieldInput'

import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useSubmission } from '@/app/providers/SubmissionProvider'
import { NumberInput } from '@/components/shared/number-input'
import { cn } from '@/lib/utils'


export default function DataForm() {
 
  const { toast } = useToast()
  const { setNewSubmissionId } = useSubmission()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: undefined,
      customFields: [],
    },
  })

  // Validate custom fields before submission
  const validateCustomFields = () => {
    const errors: string[] = []
    customFields.forEach(field => {
      if (!field.label) {
        errors.push(`Label is required for all custom fields`)
      }
      if (field.required && (!field.value || field.value === '')) {
        errors.push(`${field.label || 'Field'} is required`)
      }
      if (field.type === 'email' && typeof field.value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(field.value)) {
          errors.push(`${field.label} must be a valid email`)
        }
      }
      if (field.type === 'number' && isNaN(Number(field.value))) {
        errors.push(`${field.label} must be a valid number`)
      }
    })
    return errors
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      
      const customFieldErrors = validateCustomFields()
      if (customFieldErrors.length > 0) {
        customFieldErrors.forEach(error => {
          toast({
            title: 'Validation Error',
            description: error,
            variant: 'destructive'
          })
        })
        setIsSubmitting(false)
        return
      }
  
 
      const newSubmission: Submission = {
        id: crypto.randomUUID(), // This would normally come from backend
        name: values.name,
        email: values.email,
        age: values.age,
        customFields,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  
      const response = await createSubmission(newSubmission)
      
      if(response.success) {
        form.reset()
        
 
        const clearedCustomFieldValues = customFields.map(field => ({
          ...field,
          value: ''
        }))
        setCustomFields(clearedCustomFieldValues)
           
        if (response.id)
        setNewSubmissionId(response.id)
        
        toast({
          title: 'Success',
          description: 'Your entry has been submitted successfully',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to submit your entry. Please try again.',
          variant: 'destructive'
        })
      }
  
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your entry. Please try again.',
        variant: 'destructive'
      })
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addCustomField = () => {
    const newField: CustomField = {
      id: `field-${customFields.length + 1}`,
      label: `Field ${customFields.length + 1}`,
      type: 'text',
      value: '',
      isAdvanced: false,
      required: false
    }
    setCustomFields(prev => [...prev, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (
    id: string,
    updates: Partial<CustomField>
  ) => {
    setCustomFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    )
  }

  return (
    <Card className="border-none bg-gradient-to-b from-secondary/50 via-background to-background shadow-md">
              <CardHeader>
        <CardTitle className="text-2xl font-semibold leading-tight text-primary">
          Submit Entry
        </CardTitle>
        <CardDescription>
          Add a new submission with optional custom fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Standard Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter name" 
                        {...field} 
                        disabled={isSubmitting}
                        className="bg-card/50 shadow-sm"
                      />
                    </FormControl>
                    <div className="min-h-[20px]">
                    <FormMessage className="text-[13px] text-red-400/90" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email" 
                        type="email" 
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="min-h-[20px]">
                    <FormMessage className="text-[13px] text-red-400/90" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                    <NumberInput
          value={field.value}
          onChange={field.onChange}
          min={0}
          max={120}
          disabled={isSubmitting}
          allowFloat={false}
          className={cn(
            form.formState.errors.age && "border-red-400/50 focus:ring-red-400/30"
          )}
        />
                    </FormControl>
                    <div className="min-h-[20px]">
                    <FormMessage className="text-[13px] text-red-400/90" />
                    </div>
                  </FormItem>
                )}
              />
            </div>


<div className="rounded-lg border border-border/50 bg-muted/30">
  <div className="flex items-center justify-between border-b border-border/50 p-4">
    <h3 className="text-sm font-medium text-muted-foreground">Custom Fields</h3>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={addCustomField}
      disabled={isSubmitting}
      className="h-8 bg-background/50 hover:bg-background"
    >
      <Plus className="mr-2 h-3 w-3" />
      Add Field
    </Button>
  </div>

  {customFields.length > 0 ? (
    <div className="divide-y divide-border/50">
      {[...customFields].reverse().map((field) => (
                       <motion.div
                       key={field.id}
                       initial={{ backgroundColor: "hsl(var(--primary))", opacity: 0.5 }}
                       animate={{ backgroundColor: "transparent", opacity: 1 }}
                       transition={{ duration: 2 }}
                       className="grid grid-cols-[1fr,120px,1fr,auto] items-center gap-3 p-3"
                     >

   
          <Input
            placeholder="Field label"
            value={field.label}
            onChange={(e) =>
              updateCustomField(field.id, { label: e.target.value })
            }
            disabled={isSubmitting}
            className="h-8"
          />

          <FieldTypeSelector
            value={field.type}
            onChange={(value) =>
              updateCustomField(field.id, { 
                type: value,
                isAdvanced: isAdvancedField(value)
              })
            }
            disabled={isSubmitting}
          />

          <div className="relative">
            <CustomFieldInput
              field={field}
              onChange={(value) =>
                updateCustomField(field.id, { value })
              }
              error={field.required && (!field.value || field.value === '') 
                ? 'Required' 
                : undefined}
              disabled={isSubmitting}
            />
            {field.required && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <span className="text-sm text-red-400/80">*</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-2">
            <Switch
              id={`${field.id}-required`}
              checked={field.required}
              onCheckedChange={(checked) => 
                updateCustomField(field.id, { required: checked })
              }
              disabled={isSubmitting}
              className="h-4 w-7"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCustomField(field.id)}
              disabled={isSubmitting}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
      
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
      No custom fields added
    </div>
  )}
</div>


            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary/90 hover:bg-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}