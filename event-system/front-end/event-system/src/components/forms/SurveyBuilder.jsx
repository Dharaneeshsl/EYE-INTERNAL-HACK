import React, { useState } from "react";

export default function SurveyBuilder({ json, onSave }) {
  const [formData, setFormData] = useState({
    title: "New Survey",
    description: "Survey description",
    questions: []
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type: type,
      title: `New ${type} Question`,
      required: false,
      options: type === 'radiogroup' || type === 'checkbox' || type === 'dropdown' 
        ? ['Option 1', 'Option 2', 'Option 3'] 
        : []
    };
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const deleteQuestion = (id) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  // Drag and drop handlers
  const handleDragStart = (e, questionId) => {
    setDraggedItem(questionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null) return;
    
    const draggedIndex = formData.questions.findIndex(q => q.id === draggedItem);
    if (draggedIndex === -1 || draggedIndex === dropIndex) return;
    
    const newQuestions = [...formData.questions];
    const draggedQuestion = newQuestions[draggedIndex];
    
    // Remove from old position
    newQuestions.splice(draggedIndex, 1);
    
    // Insert at new position
    const newIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newQuestions.splice(newIndex, 0, draggedQuestion);
    
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleSave = () => {
    const surveyJson = {
      title: formData.title,
      description: formData.description,
      pages: [{
        name: "page1",
        title: "Page 1",
        elements: formData.questions.map(q => ({
          type: q.type,
          name: `question_${q.id}`,
          title: q.title,
          isRequired: q.required,
          ...(q.options.length > 0 && { choices: q.options })
        }))
      }]
    };
    
    if (onSave) {
      onSave(surveyJson);
    }
  };

  // Update form data when questions change
  React.useEffect(() => {
    const surveyJson = {
      title: formData.title,
      description: formData.description,
      pages: [{
        name: "page1",
        title: "Page 1",
        elements: formData.questions.map(q => ({
          type: q.type,
          name: `question_${q.id}`,
          title: q.title,
          isRequired: q.required,
          ...(q.options.length > 0 && { choices: q.options })
        }))
      }]
    };
    
    if (onSave) {
      onSave(surveyJson);
    }
  }, [formData, onSave]);

    return (
      <div style={{ 
      minHeight: "600px", 
        backgroundColor: "#1a1a1a", 
        border: "1px solid #ffffff", 
        borderRadius: "8px",
        padding: "20px",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#ffffff", marginBottom: "10px" }}>📝 Form Builder</h2>
        <p style={{ color: "#cccccc", fontSize: "14px" }}>
          Build your form by adding questions below
        </p>
      </div>

      {/* Form Title and Description */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Form Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#2a2a2a",
            color: "#ffffff",
            border: "1px solid #ffffff",
            borderRadius: "4px"
          }}
        />
        <input
          type="text"
          placeholder="Form Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#2a2a2a",
            color: "#ffffff",
            border: "1px solid #ffffff",
            borderRadius: "4px"
          }}
        />
      </div>

      <div style={{ 
        display: "flex", 
        gap: "20px", 
        flex: 1,
        minHeight: "400px",
        width: "100%"
      }}>
          {/* Left Panel - Question Types */}
        <div style={{ 
          flex: "0 0 280px", 
          border: "1px solid #ffffff", 
          borderRadius: "8px", 
          padding: "15px",
          backgroundColor: "#2a2a2a",
          height: "fit-content",
          maxHeight: "500px",
          overflow: "auto"
        }}>
          <h3 style={{ color: "#ffffff", marginBottom: "15px" }}>Question Types</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
              onClick={() => addQuestion('text')}
                style={{ 
                padding: "12px",
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
                }}
              >
                📝 Text Question
              </button>
              <button 
              onClick={() => addQuestion('comment')}
              style={{
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #ffffff",
                color: "#ffffff",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              📄 Long Text
            </button>
            <button
              onClick={() => addQuestion('radiogroup')}
              style={{
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #ffffff",
                color: "#ffffff",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🔘 Radio Buttons
            </button>
            <button
              onClick={() => addQuestion('checkbox')}
                style={{ 
                padding: "12px",
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
                }}
              >
              ☑️ Checkboxes
              </button>
              <button 
              onClick={() => addQuestion('dropdown')}
                style={{ 
                padding: "12px",
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
                }}
              >
              📋 Dropdown
              </button>
              <button 
              onClick={() => addQuestion('rating')}
                style={{ 
                padding: "12px",
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left"
                }}
              >
              ⭐ Rating
              </button>
            </div>
          </div>
          
          {/* Right Panel - Form Preview */}
        <div style={{ 
          flex: 1, 
          border: "1px solid #ffffff", 
          borderRadius: "8px", 
          padding: "15px",
          backgroundColor: "#2a2a2a",
          overflow: "auto",
          minHeight: "400px",
          maxHeight: "600px"
        }}>
          <h3 style={{ color: "#ffffff", marginBottom: "15px" }}>Form Preview</h3>
          
          {formData.questions.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              color: "#cccccc", 
              padding: "40px",
              border: "2px dashed #ffffff",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>📝</div>
              <div>No questions added yet</div>
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                Click on question types to add them, then drag to reorder
              </div>
            </div>
          ) : (
    <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "15px",
              width: "100%"
            }}>
              {formData.questions.map((question, index) => (
                <div 
                  key={question.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, question.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    border: dragOverIndex === index ? "2px solid #22c55e" : "1px solid #ffffff",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: draggedItem === question.id ? "#333333" : "#1a1a1a",
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: "move",
                    transition: "all 0.2s ease",
                    opacity: draggedItem === question.id ? 0.7 : 1,
                    transform: draggedItem === question.id ? "rotate(2deg)" : "none"
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start", 
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "200px" }}>
                      <div style={{ 
                        color: "#cccccc", 
                        fontSize: "16px",
                        cursor: "move",
                        padding: "4px"
                      }}>
                        ⋮⋮
                      </div>
                      <h4 style={{ 
                        color: "#ffffff", 
                        margin: 0,
                        flex: 1
                      }}>
                        {index + 1}. {question.title}
                        {question.required && <span style={{ color: "#ff6b6b", marginLeft: "5px" }}>*</span>}
                      </h4>
                    </div>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ff6b6b",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        flexShrink: 0
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
        style={{ 
          width: "100%",
                      padding: "8px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      border: "1px solid #ffffff",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      boxSizing: "border-box"
                    }}
                  />
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "10px"
                  }}>
                    <label style={{ 
                      color: "#ffffff", 
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      />
                      Required
                    </label>
                    
                    <span style={{ 
                      color: "#cccccc", 
                      fontSize: "12px",
                      padding: "4px 8px",
                      backgroundColor: "#333333",
                      borderRadius: "4px"
                    }}>
                      Type: {question.type}
                    </span>
                  </div>
                  
                  {(question.type === 'radiogroup' || question.type === 'checkbox' || question.type === 'dropdown') && (
                    <div style={{ 
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "#333333",
                      borderRadius: "4px",
                      border: "1px solid #555555"
                    }}>
                      <label style={{ 
                        color: "#ffffff", 
                        fontSize: "14px", 
                        display: "block", 
                        marginBottom: "10px",
                        fontWeight: "bold"
                      }}>
                        Options:
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} style={{ 
                            display: "flex", 
                            gap: "8px", 
                            alignItems: "center",
                            width: "100%"
                          }}>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              style={{
                                flex: 1,
                                padding: "8px",
                                backgroundColor: "#2a2a2a",
                                color: "#ffffff",
                                border: "1px solid #ffffff",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                              }}
                            />
                            <button
                              onClick={() => {
                                const newOptions = question.options.filter((_, i) => i !== optionIndex);
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#ff6b6b",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                flexShrink: 0
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [...question.options, `Option ${question.options.length + 1}`];
                            updateQuestion(question.id, 'options', newOptions);
                          }}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#22c55e",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            alignSelf: "flex-start"
                          }}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Only one button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => {
            // Create the survey JSON
            const surveyJson = {
              title: formData.title,
              description: formData.description,
              pages: [{
                name: "page1",
                title: "Page 1",
                elements: formData.questions.map(q => ({
                  type: q.type,
                  name: `question_${q.id}`,
                  title: q.title,
                  isRequired: q.required,
                  ...(q.options.length > 0 && { choices: q.options })
                }))
              }]
            };
            
            // Call the parent's save function
            if (onSave) {
              onSave(surveyJson);
            }
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          💾 Save Form
        </button>
      </div>
    </div>
  );
}