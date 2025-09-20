import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PreviewTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PreviewDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FieldLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${props => props.required ? 'bold' : 'normal'};

  &::after {
    content: "${props => props.required ? ' *' : ''}";
    color: ${({ theme }) => theme.colors.error};
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const OptionContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const FormPreview = ({ form }) => {
  const renderField = (field) => {
    switch (field.type) {
      case 'Short Text':
      case 'Email':
      case 'Phone Number':
        return (
          <TextInput
            type={field.type === 'Email' ? 'email' : field.type === 'Phone Number' ? 'tel' : 'text'}
            placeholder={field.placeholder}
          />
        );
      case 'Long Text':
        return (
          <TextArea
            placeholder={field.placeholder}
          />
        );
      case 'Multiple Choice':
        return (
          <OptionContainer>
            {field.options?.map((option, index) => (
              <OptionLabel key={index}>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                /> {option}
              </OptionLabel>
            ))}
          </OptionContainer>
        );
      case 'Checkbox':
        return (
          <OptionContainer>
            {field.options?.map((option, index) => (
              <OptionLabel key={index}>
                <input
                  type="checkbox"
                  name={field.id}
                  value={option}
                /> {option}
              </OptionLabel>
            ))}
          </OptionContainer>
        );
      case 'Date':
        return (
          <TextInput
            type="date"
          />
        );
      case 'Rating':
        return (
          <OptionContainer>
            {[1, 2, 3, 4, 5].map((value) => (
              <OptionLabel key={value}>
                <input
                  type="radio"
                  name={field.id}
                  value={value}
                /> {value}
              </OptionLabel>
            ))}
          </OptionContainer>
        );
      default:
        return null;
    }
  };

  return (
    <PreviewContainer>
      <PreviewTitle>{form.title || 'Untitled Form'}</PreviewTitle>
      {form.description && (
        <PreviewDescription>{form.description}</PreviewDescription>
      )}
      {form.elements.map((field) => (
        <FormField key={field.id}>
          <FieldLabel required={field.required}>
            {field.label}
          </FieldLabel>
          {renderField(field)}
        </FormField>
      ))}
    </PreviewContainer>
  );
};

export default FormPreview;