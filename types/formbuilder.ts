// FormBuilder 타입 정의

export interface FormFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface FormFieldValidation {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: string;
  validator?: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'daterange' | 'time' | 'datetime' | 'richtext' | 'upload' | 'tags';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string | string[];
  width?: string;
  size?: 'small' | 'middle' | 'large';
  maxLength?: number;
  minHeight?: string;
  maxCount?: number;
  maxSize?: number;
  accept?: string;
  disabled?: boolean;
  disabledMessage?: string;
  format?: string;
  mode?: 'multiple' | 'tags';
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  fields: FormField[];
}

export interface FormBuilderDefinition {
  formId: string;
  formName: string;
  category: string;
  version: string;
  sections: FormSection[];
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    description?: string;
  };
}
