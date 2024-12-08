import { z } from "zod"

const customFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(['text', 'number', 'email', 'file', 'date', 'location', 'price', 'multiselect', 'richtext']),
  value: z.union([z.string(), z.number()]),
  isAdvanced: z.boolean(),
  required: z.boolean().optional()
}).refine((field) => {
  if (field.type === 'number') {
    return !isNaN(Number(field.value))
  }
  if (field.type === 'email' && typeof field.value === 'string') {
    return z.string().email().safeParse(field.value).success
  }

  return true
}, {
  message: "Invalid value for field type",
  path: ["value"]
}).refine((field) => {
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
  email: z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required"), // Covers empty string explicitly
  age: z
  .number({
    required_error: "Age is required", // This will show instead of "Required"
    invalid_type_error: "Age must be a number",
  })
  .min(0, "Age must be a positive number")
  .max(120, "Age must be less than 120"),
  customFields: z.array(customFieldSchema)
})

export type FormValues = z.infer<typeof formSchema>