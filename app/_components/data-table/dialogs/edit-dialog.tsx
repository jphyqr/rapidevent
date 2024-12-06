'use client'

import { Button } from "@/components/ui/button"
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog"
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CustomField, isAdvancedField, type Submission } from "@/lib/types/customField"

import { NumberInput } from "@/components/shared/number-input"
import { useToast } from "@/hooks/use-toast"
import { formSchema } from "../../data-form/schema"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import {  FieldTypeSelector } from "../../data-form/CustomFieldInput"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { UpdateSubmissionResponse } from "@/lib/actions"

interface EditDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 submission: Submission
 onSubmit: (data: Submission) => Promise<UpdateSubmissionResponse>
}

export function EditDialog({
 open,
 onOpenChange,
 submission,
 onSubmit,
}: EditDialogProps) {
 const { toast } = useToast()
 const [customFields, setCustomFields] = useState<CustomField[]>(submission.customFields)
 const addCustomField = () => {
    const newField: CustomField = {
      id: String(customFields.length + 1),
      label: '',
      type: 'text',
      value: '',
      isAdvanced: false,
      required: false
    }
    setCustomFields([...customFields, newField])
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
 const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        age: submission.age, // Explicitly set age
        customFields: submission.customFields,
        createdAt: submission.createdAt,
    }
  })

  const handleSubmit = async (values: Submission) => {
    const response = await onSubmit(values)
    
    if (response.success) {
      onOpenChange(false)
      toast({
        title: "Success",
        description: "Entry updated successfully"
      })
    } else {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive"
      })
    }
  }

 return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => {

    const updatedSubmission = {
        ...values,
        id: submission.id,
        customFields,
        updatedAt: new Date()
      }

    handleSubmit(updatedSubmission);
  })}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                    
                        {...field}
                   
                   />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    {...field}
/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <div className="space-y-4 rounded-lg bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-primary">Custom Fields</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
 
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr,1fr,auto]"
                  >
                    <div className="space-y-2">
                      <FormLabel>Field Label</FormLabel>
                      <Input
                        placeholder="Enter label"
                        value={field.label}
                        onChange={(e) =>
                          updateCustomField(field.id, { label: e.target.value })
                        }
                      />
                    </div>
 
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Field Type</FormLabel>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${field.id}-required`} className="text-sm">Required</Label>
                          <Switch
                            id={`${field.id}-required`}
                            checked={field.required}
                            onCheckedChange={(checked) => 
                              updateCustomField(field.id, { required: checked })
                            }
                          />
                        </div>
                      </div>
                      <FieldTypeSelector
                        value={field.type}
                        onChange={(value) =>
                          updateCustomField(field.id, { 
                            type: value,
                            isAdvanced: isAdvancedField(value)
                          })
                        }
                      />
                    </div>
 
                    <div className="space-y-2">
                      <FormLabel>Value</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={field.value}
                            onChange={(e) => 
                              updateCustomField(field.id, { value: e.target.value })
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeCustomField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="flex justify-end space-x-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}