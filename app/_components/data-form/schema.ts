// app/_components/data-form/schema.ts
import { z } from "zod"

const customFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(['text', 'number', 'email', 'file', 'date', 'location', 'price', 'multiselect', 'richtext']),
  value: z.union([z.string(), z.number()]),
  isAdvanced: z.boolean(),
  required: z.boolean().optional()
}).refine((field) => {
  // Validate value based on type
  if (field.type === 'number') {
    return !isNaN(Number(field.value))
  }
  if (field.type === 'email' && typeof field.value === 'string') {
    return z.string().email().safeParse(field.value).success
  }
  // Add more type-specific validations as needed
  return true
}, {
  message: "Invalid value for field type",
  path: ["value"]
}).refine((field) => {
  // Check required fields have values
  if (field.required && (!field.value || field.value === '')) {
    return false
  }
  return true
}, {
  message: "This field is required",
  path: ["value"]
})

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(0, "Age must be a positive number"),
  customFields: z.array(customFieldSchema)
})

export type FormValues = z.infer<typeof formSchema>