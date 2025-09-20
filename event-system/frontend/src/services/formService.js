import api from '../utils/api';

export const createForm = async (formData) => {
  const response = await api.post('/forms', {
    title: formData.title,
    description: formData.description,
    questions: formData.elements.map((element, index) => ({
      questionId: element.id,
      questionType: mapQuestionType(element.type),
      questionText: element.label,
      required: element.required || false,
      options: element.options?.map(opt => ({ value: opt, label: opt })) || [],
      order: index,
      validation: {
        minLength: element.minLength,
        maxLength: element.maxLength,
        pattern: element.pattern,
        errorMessage: element.errorMessage,
      },
    })),
    settings: {
      requiresLogin: false,
      isAnonymous: true,
      allowMultipleResponses: true,
      showProgressBar: true,
      showQuestionNumbers: true,
    },
  });
  return response.data;
};

export const updateForm = async (formId, formData) => {
  const response = await api.put(`/forms/${formId}`, {
    title: formData.title,
    description: formData.description,
    questions: formData.elements.map((element, index) => ({
      questionId: element.id,
      questionType: mapQuestionType(element.type),
      questionText: element.label,
      required: element.required || false,
      options: element.options?.map(opt => ({ value: opt, label: opt })) || [],
      order: index,
      validation: {
        minLength: element.minLength,
        maxLength: element.maxLength,
        pattern: element.pattern,
        errorMessage: element.errorMessage,
      },
    })),
  });
  return response.data;
};

export const getForm = async (formId) => {
  const response = await api.get(`/forms/${formId}`);
  const form = response.data.data;
  return {
    title: form.title,
    description: form.description,
    elements: form.questions.map(question => ({
      id: question.questionId,
      type: mapTypeToFormBuilder(question.questionType),
      label: question.questionText,
      required: question.required,
      options: question.options?.map(opt => opt.value) || [],
      validation: {
        minLength: question.validation?.minLength,
        maxLength: question.validation?.maxLength,
        pattern: question.validation?.pattern,
        errorMessage: question.validation?.errorMessage,
      },
    })),
  };
};

export const getAllForms = async () => {
  const response = await api.get('/forms');
  return response.data.data;
};

export const deleteForm = async (formId) => {
  const response = await api.delete(`/forms/${formId}`);
  return response.data;
};

// Helper function to map form builder types to backend types
const mapQuestionType = (formBuilderType) => {
  const typeMap = {
    'Short Text': 'text',
    'Long Text': 'textarea',
    'Multiple Choice': 'radio',
    'Checkbox': 'checkbox',
    'Rating': 'rating',
    'Date': 'date',
    'Email': 'email',
    'Phone Number': 'text',
  };
  return typeMap[formBuilderType] || 'text';
};

// Helper function to map backend types to form builder types
const mapTypeToFormBuilder = (backendType) => {
  const typeMap = {
    'text': 'Short Text',
    'textarea': 'Long Text',
    'radio': 'Multiple Choice',
    'checkbox': 'Checkbox',
    'rating': 'Rating',
    'date': 'Date',
    'email': 'Email',
  };
  return typeMap[backendType] || 'Short Text';
};