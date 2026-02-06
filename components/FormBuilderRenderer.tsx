"use client";

import React from 'react';
import { Card, Form, Input, Select, Checkbox, Radio, DatePicker, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import RichTextEditor from './RichTextEditor';
import type { FormBuilderDefinition, FormField, FormSection } from '@/types/formbuilder';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface FormBuilderRendererProps {
  definition: FormBuilderDefinition;
  form: FormInstance;
  onChange?: (fieldName: string, value: any) => void;
}

export default function FormBuilderRenderer({ definition, form, onChange }: FormBuilderRendererProps) {
  
  const handleFieldChange = (fieldName: string, value: any) => {
    if (onChange) {
      onChange(fieldName, value);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      placeholder: Array.isArray(field.placeholder) ? undefined : field.placeholder,
      disabled: field.disabled,
      size: field.size,
      style: field.width ? { width: field.width } : undefined,
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            {...commonProps}
            maxLength={field.maxLength}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            rows={4}
            maxLength={field.maxLength}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      case 'number':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: field.width || '200px' }}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            style={{ width: field.width || '100%' }}
            options={field.options}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        );

      case 'multiselect':
        return (
          <Select
            {...commonProps}
            mode="multiple"
            style={{ width: field.width || '100%' }}
            options={field.options}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        );

      case 'tags':
        return (
          <Select
            {...commonProps}
            mode={field.mode || 'tags'}
            style={{ width: field.width || '100%' }}
            options={field.options}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        );

      case 'checkbox':
        return (
          <Checkbox.Group
            options={field.options}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        );

      case 'radio':
        return (
          <Radio.Group
            options={field.options}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            format={field.format || 'YYYY-MM-DD'}
            style={{ width: field.width || '200px' }}
            onChange={(date, dateString) => handleFieldChange(field.name, dateString)}
          />
        );

      case 'daterange':
        return (
          <RangePicker
            {...commonProps}
            format={field.format || 'YYYY-MM-DD'}
            placeholder={Array.isArray(field.placeholder) ? field.placeholder as [string, string] : undefined}
            style={{ width: field.width || '100%' }}
            onChange={(dates, dateStrings) => handleFieldChange(field.name, dateStrings)}
          />
        );

      case 'richtext':
        return (
          <div style={{ minHeight: field.minHeight }}>
            <RichTextEditor
              placeholder={field.placeholder as string}
              onChange={(html) => {
                handleFieldChange(field.name, html);
                form.setFieldsValue({ [field.name]: html });
              }}
            />
          </div>
        );

      case 'upload':
        return (
          <Upload
            disabled={field.disabled}
            maxCount={field.maxCount}
            accept={field.accept}
            beforeUpload={() => false}
            onChange={(info) => handleFieldChange(field.name, info.fileList)}
          >
            <Button icon={<UploadOutlined />} disabled={field.disabled}>
              {field.disabledMessage || field.placeholder || '파일 선택'}
            </Button>
          </Upload>
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  const renderSection = (section: FormSection) => {
    return (
      <Card
        key={section.id}
        size="small"
        title={section.title}
        style={{ 
          marginBottom: 16, 
          background: section.backgroundColor || '#ffffff' 
        }}
      >
        {section.description && (
          <div style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
            {section.description}
          </div>
        )}
        
        {section.fields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.name}
            rules={field.validation ? [
              {
                required: field.validation.required,
                message: field.validation.message,
                min: field.validation.min,
                max: field.validation.max,
                pattern: field.validation.pattern ? new RegExp(field.validation.pattern) : undefined,
              }
            ] : undefined}
            initialValue={field.defaultValue}
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </Card>
    );
  };

  return (
    <div>
      {definition.sections.map((section) => renderSection(section))}
    </div>
  );
}
