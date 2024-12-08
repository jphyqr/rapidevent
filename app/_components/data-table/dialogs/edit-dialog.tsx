'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/shared/number-input"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UpdateSubmissionResponse } from "@/lib/actions"
import { CustomField, Submission } from "@/lib/types/customField"
import { formSchema } from "../../data-form/schema"
import { CompactCustomField } from "../../data-form/CompactCustomFieldInput"

interface EditDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 submission: Submission
 onSubmit: (data: Submission) => Promise<UpdateSubmissionResponse>
}

export function EditDialog({ open, onOpenChange, submission, onSubmit }: EditDialogProps) {
 const { toast } = useToast()
 const [customFields, setCustomFields] = useState<CustomField[]>(submission.customFields)
 const [fieldErrors, setFieldErrors] = useState<Map<string, string>>(new Map())

 const form = useForm({
   resolver: zodResolver(formSchema),
   defaultValues: submission
 })

 const validateCustomFields = () => {
   const errors = new Map<string, string>()
   customFields.forEach(field => {
     if (field.required && (!field.value || field.value === '')) {
       errors.set(field.id, 'Required')
     }
     // Add more validation as needed
   })
   return errors
 }

 const handleSubmit = async (values: Submission) => {
   const errors = validateCustomFields()
   if (errors.size > 0) {
     setFieldErrors(errors)
     toast({
       title: "Validation Error",
       description: "Please fill in all required fields",
       variant: "destructive"
     })
     return
   }

   const response = await onSubmit({
     ...values,
     customFields,
     updatedAt: new Date(),
     createdAt: submission.createdAt,
     id: submission.id
   })

   if (response.success) {
     onOpenChange(false)
     toast({ title: "Success", description: "Entry updated successfully" })
   } else {
     toast({ title: "Error", description: response.error, variant: "destructive" })
   }
 }

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="max-w-2xl">
       <DialogHeader>
         <DialogTitle>Edit Entry</DialogTitle>
       </DialogHeader>
       <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
           <div className="grid gap-4 md:grid-cols-2">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Name</FormLabel>
                   <FormControl>
                     <Input {...field} />
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
                     <NumberInput {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
           </div>

           <div className="rounded-lg border p-4">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-medium">Custom Fields</h3>
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   const label = window.prompt("Enter field label")
                   if (label) {
                     setCustomFields([...customFields, {
                       id: String(customFields.length + 1),
                       label,
                       type: 'text',
                       value: '',
                       isAdvanced: false,
                       required: false
                     }])
                   }
                 }}
               >
                 <Plus className="h-4 w-4 mr-1" />
                 Add Field
               </Button>
             </div>

             <div className="space-y-2">
               {customFields.map((field) => (
                 <CompactCustomField
                   key={field.id}
                   field={field}
                   error={fieldErrors.get(field.id)}
                   onChange={(value) => {
                     setFieldErrors(prev => {
                       const next = new Map(prev)
                       next.delete(field.id)
                       return next
                     })
                     setCustomFields(fields =>
                       fields.map(f =>
                         f.id === field.id ? { ...f, value } : f
                       )
                     )
                   }}
                   onRemove={() => {
                     setCustomFields(fields => 
                       fields.filter(f => f.id !== field.id)
                     )
                   }}
                   isOriginal={submission.customFields.some(f => f.id === field.id)}
                 />
               ))}
             </div>
           </div>

           <div className="flex justify-end">
             <Button type="submit">Save Changes</Button>
           </div>
         </form>
       </Form>
     </DialogContent>
   </Dialog>
 )
}