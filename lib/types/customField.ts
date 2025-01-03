
export type BasicFieldType = 'text' | 'number' | 'email'

// These are shown but disabled in the UI
export type AdvancedFieldType = 
  | 'file'
  | 'date'
  | 'location'
  | 'price'
  | 'multiselect'
  | 'richtext'
  | 'currency'

export type FieldType = BasicFieldType | AdvancedFieldType

export interface CustomField {
  id: string
  label: string
  type: FieldType
  value: string | number
  isAdvanced: boolean 
  required?: boolean
}


export const isAdvancedField = (type: FieldType): type is AdvancedFieldType => {
  const advancedTypes: AdvancedFieldType[] = [
    'file',
    'date',
    'location',
    'price',
    'multiselect',
    'richtext',
  
  ]
  return advancedTypes.includes(type as AdvancedFieldType)
}

export type Submission = {
  id: string
  name: string
  email: string
  age: number
  customFields: CustomField[]
  createdAt: Date
  updatedAt: Date
}