import React, { useEffect, useRef, useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.css";

export default function SurveyBuilder({ json, onSave }) {
  const creatorRef = useRef(null);
  const [creator, setCreator] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!creatorRef.current) return;

    try {
      // Create the SurveyJS Creator with minimal configuration
      const surveyCreator = new SurveyCreator({
        showLogicTab: false,
        showTranslationTab: false,
        showDesignerTab: true,
        showTestSurveyTab: true,
        showJSONEditorTab: false,
        showEmbededSurveyTab: false,
        showPropertyGrid: true,
        showToolbox: true
      });

      // Set initial JSON
      surveyCreator.JSON = json && Object.keys(json).length > 0 ? json : {
        "title": "New Survey",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1",
                "title": "What is your name?",
                "isRequired": true
              }
            ]
          }
        ]
      };

      // Handle save
      surveyCreator.onSurveyInstanceCreated.add((sender, options) => {
        if (onSave) {
          onSave(surveyCreator.JSON);
        }
      });

      // Render the creator
      surveyCreator.render(creatorRef.current);
      setCreator(surveyCreator);
      setIsLoaded(true);

      // Apply dark theme after a delay
      setTimeout(() => {
        const applyTheme = () => {
          const elements = document.querySelectorAll('.sv_main, .sv_toolbox, .sv_canvas, .sv_property-editor');
          elements.forEach(el => {
            if (el) {
              el.style.backgroundColor = '#1a1a1a';
              el.style.color = '#ffffff';
              el.style.borderColor = '#ffffff';
            }
          });
        };
        applyTheme();
      }, 1000);

      return () => {
        if (surveyCreator) {
          surveyCreator.dispose();
        }
      };
    } catch (error) {
      console.error('Error creating SurveyJS Creator:', error);
      setIsLoaded(true);
    }
  }, []);

  // Fallback form builder if SurveyJS doesn't load
  if (isLoaded && !creator) {
    return (
      <div style={{ 
        height: "600px", 
        backgroundColor: "#1a1a1a", 
        border: "1px solid #ffffff", 
        borderRadius: "8px",
        padding: "20px",
        color: "#ffffff"
      }}>
        <h3 style={{ color: "#ffffff", marginBottom: "20px" }}>Simple Form Builder</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "500px" }}>
          {/* Left Panel - Question Types */}
          <div style={{ border: "1px solid #ffffff", padding: "15px", borderRadius: "8px" }}>
            <h4 style={{ color: "#ffffff", marginBottom: "15px" }}>Question Types</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
                style={{ 
                  padding: "10px", 
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => onSave && onSave({...json, elements: [...(json?.elements || []), {type: "text", name: "question" + Date.now(), title: "New Text Question"}]})}
              >
                📝 Text Question
              </button>
              <button 
                style={{ 
                  padding: "10px", 
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => onSave && onSave({...json, elements: [...(json?.elements || []), {type: "radiogroup", name: "question" + Date.now(), title: "New Radio Question", choices: ["Option 1", "Option 2"]}]})}
              >
                🔘 Radio Question
              </button>
              <button 
                style={{ 
                  padding: "10px", 
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => onSave && onSave({...json, elements: [...(json?.elements || []), {type: "checkbox", name: "question" + Date.now(), title: "New Checkbox Question", choices: ["Option 1", "Option 2"]}]})}
              >
                ☑️ Checkbox Question
              </button>
              <button 
                style={{ 
                  padding: "10px", 
                  backgroundColor: "#1a1a1a", 
                  border: "1px solid #ffffff", 
                  color: "#ffffff", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => onSave && onSave({...json, elements: [...(json?.elements || []), {type: "dropdown", name: "question" + Date.now(), title: "New Dropdown Question", choices: ["Option 1", "Option 2"]}]})}
              >
                📋 Dropdown Question
              </button>
            </div>
          </div>
          
          {/* Right Panel - Form Preview */}
          <div style={{ border: "1px solid #ffffff", padding: "15px", borderRadius: "8px" }}>
            <h4 style={{ color: "#ffffff", marginBottom: "15px" }}>Form Preview</h4>
            <div style={{ color: "#cccccc" }}>
              {json?.elements?.length > 0 ? (
                json.elements.map((element, index) => (
                  <div key={index} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ffffff", borderRadius: "4px" }}>
                    <strong>{element.title || "Untitled Question"}</strong>
                    <div style={{ marginTop: "5px", fontSize: "14px" }}>
                      Type: {element.type}
                    </div>
                  </div>
                ))
              ) : (
                <div>No questions added yet. Click on question types to add them.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: "600px", 
      backgroundColor: "#1a1a1a", 
      border: "1px solid #ffffff", 
      borderRadius: "8px",
      position: "relative",
      overflow: "hidden"
    }}>
      {!isLoaded && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#ffffff",
          fontSize: "18px",
          zIndex: 10
        }}>
          Loading Form Builder...
        </div>
      )}
      <div 
        ref={creatorRef} 
        style={{ 
          height: "100%", 
          width: "100%",
          backgroundColor: "#1a1a1a"
        }} 
      />
    </div>
  );
}
