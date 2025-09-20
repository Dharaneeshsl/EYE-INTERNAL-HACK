import React from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const OptionsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FormElementEditor = ({ element, onUpdate }) => {
  const handleUpdate = (updates) => {
    onUpdate({ ...element, ...updates });
  };

  const addOption = () => {
    const options = element.options || [];
    handleUpdate({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index, value) => {
    const options = [...(element.options || [])];
    options[index] = value;
    handleUpdate({ options: options });
  };

  const deleteOption = (index) => {
    const options = [...(element.options || [])];
    options.splice(index, 1);
    handleUpdate({ options: options });
  };

  return (
    <EditorContainer>
      <Label>Field Label</Label>
      <Input
        value={element.label}
        onChange={(e) => handleUpdate({ label: e.target.value })}
        placeholder="Enter field label"
      />

      <Label>
        <Checkbox
          checked={element.required}
          onChange={(e) => handleUpdate({ required: e.target.checked })}
        />
        Required Field
      </Label>

      {element.type !== 'Multiple Choice' && element.type !== 'Checkbox' && (
        <Label>
          <Input
            value={element.placeholder || ''}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </Label>
      )}

      {(element.type === 'Multiple Choice' || element.type === 'Checkbox') && (
        <OptionsList>
          <Label>Options</Label>
          {(element.options || []).map((option, index) => (
            <OptionItem key={index}>
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button onClick={() => deleteOption(index)}>×</Button>
            </OptionItem>
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </OptionsList>
      )}
    </EditorContainer>
  );
};

export default FormElementEditor;