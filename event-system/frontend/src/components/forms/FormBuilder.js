import React, { useState, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import FormElementEditor from './FormElementEditor';
import FormPreview from './FormPreview';
import { createForm, updateForm, getForm } from '../../services/formService';

const FormBuilderContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg};
`;

const FormBuilderHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormTitle = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  padding: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FormDescription = styled.textarea`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ToolboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ToolboxItem = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FormPreviewArea = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  min-height: 200px;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: grab;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ElementTitle = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DeleteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  float: right;

  &:hover {
    opacity: 0.9;
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'secondary' ? props.theme.colors.background : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.text.primary : 'white'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  margin-left: ${({ theme }) => theme.spacing.md};

  &:hover {
    opacity: 0.9;
    border-color: ${props => props.variant === 'secondary' ? props.theme.colors.primary : 'none'};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EmptyPreviewText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formElements, setFormElements] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      if (id) {
        try {
          const formData = await getForm(id);
          setFormTitle(formData.title);
          setFormDescription(formData.description);
          setFormElements(formData.elements);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    loadForm();
  }, [id]);

  const formComponents = [
    'Short Text',
    'Long Text',
    'Multiple Choice',
    'Checkbox',
    'Rating',
    'Date',
    'Email',
    'Phone Number',
  ];

  const handleAddComponent = (componentType) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: componentType,
      label: `New ${componentType}`,
      required: false
    };
    setFormElements([...formElements, newElement]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormElements(items);
  };

  const handleElementLabelChange = (id, newLabel) => {
    setFormElements(formElements.map(element =>
      element.id === id ? { ...element, label: newLabel } : element
    ));
  };

  const handleDeleteElement = (id) => {
    setFormElements(formElements.filter(element => element.id !== id));
  };

  const handleSaveForm = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const formData = {
        title: formTitle,
        description: formDescription,
        elements: formElements
      };

      if (id) {
        await updateForm(id, formData);
      } else {
        const result = await createForm(formData);
        navigate(`/forms/${result.data._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formData = {
    title: formTitle,
    description: formDescription,
    elements: formElements
  };

  if (isPreviewMode) {
    return (
      <FormBuilderContainer>
        <FormPreview form={formData} />
        <ButtonContainer>
          <ActionButton variant="secondary" onClick={() => setIsPreviewMode(false)}>
            Back to Editor
          </ActionButton>
        </ButtonContainer>
      </FormBuilderContainer>
    );
  }

  return (
    <FormBuilderContainer>
      <FormBuilderHeader>
        <FormTitle
          placeholder="Enter form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <FormDescription
          placeholder="Enter form description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />
      </FormBuilderHeader>

      <ToolboxContainer>
        {formComponents.map((component) => (
          <ToolboxItem
            key={component}
            onClick={() => handleAddComponent(component)}
          >
            {component}
          </ToolboxItem>
        ))}
      </ToolboxContainer>

      <FormPreviewArea>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="form-elements">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {formElements.length === 0 ? (
                  <EmptyPreviewText>
                    Drag and drop form elements here
                  </EmptyPreviewText>
                ) : (
                  formElements.map((element, index) => (
                    <Draggable
                      key={element.id}
                      draggableId={element.id}
                      index={index}
                    >
                      {(provided) => (
                        <FormElement
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DeleteButton
                            onClick={() => handleDeleteElement(element.id)}
                          >
                            ×
                          </DeleteButton>
                          <ElementTitle
                            value={element.label}
                            onChange={(e) =>
                              handleElementLabelChange(element.id, e.target.value)
                            }
                          />
                          <div>{element.type}</div>
                          <FormElementEditor 
                            element={element} 
                            onUpdate={(updatedElement) => {
                              const newElements = [...formElements];
                              const index = newElements.findIndex(e => e.id === element.id);
                              if (index !== -1) {
                                newElements[index] = updatedElement;
                                setFormElements(newElements);
                              }
                            }}
                          />
                        </FormElement>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </FormPreviewArea>

      <ButtonContainer>
        {error && (
          <div style={{ color: 'red', marginRight: 'auto' }}>{error}</div>
        )}
        <ActionButton variant="secondary" onClick={() => setIsPreviewMode(true)}>
          Preview Form
        </ActionButton>
        <ActionButton 
          onClick={handleSaveForm} 
          disabled={isSaving || !formTitle.trim()}
        >
          {isSaving ? 'Saving...' : 'Save Form'}
        </ActionButton>
      </ButtonContainer>
    </FormBuilderContainer>
  );
};

export default FormBuilder;