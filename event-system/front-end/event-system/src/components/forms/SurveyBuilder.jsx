import React, { useState, useEffect } from "react";
import { Survey } from "survey-react-ui";
import { SurveyCreator } from "survey-creator-react";
import QRCode from "qrcode";

export default function SurveyBuilder({ json, onSave }) {
  const [surveyJson, setSurveyJson] = useState(json || {
    title: "New Survey",
    pages: [{
      name: "page1",
      elements: [{
        type: "text",
        name: "question1",
        title: "Enter your question here"
      }]
    }]
  });

  const [surveyLink, setSurveyLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update surveyJson when json prop changes
  useEffect(() => {
    if (json) {
      setSurveyJson(json);
    }
  }, [json]);

  const handleSurveyChange = (survey) => {
    try {
      const newJson = survey.toJSON();
      setSurveyJson(newJson);
      setError('');
    } catch (err) {
      setError('Error updating survey: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setLoading(true);
    setError('');
    
    try {
      await onSave(surveyJson);
    } catch (err) {
      setError('Failed to save survey: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    try {
      setError('');
      const baseUrl = window.location.origin;
      const surveyId = surveyJson.title?.replace(/\s+/g, '-').toLowerCase() || 'survey';
      const link = `${baseUrl}/feedback/${surveyId}`;
      setSurveyLink(link);
      setShowLink(true);
      
      // Generate QR Code
      const qrCodeDataURL = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrCodeDataURL);
    } catch (error) {
      setError('Error generating QR code: ' + error.message);
      console.error('Error generating QR code:', error);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyLink);
      // You could replace this with a toast notification
      alert('Survey link copied to clipboard!');
    } catch (error) {
      setError('Failed to copy link: ' + error.message);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-white text-lg font-semibold">Survey Builder</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Survey'}
          </button>
          <button 
            onClick={generateLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Link
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {showLink && (
        <div className="mb-4 p-4 bg-gray-900 border border-white rounded-lg">
          <h4 className="text-white font-semibold mb-4">Survey Link & QR Code:</h4>
          
          {/* Survey Link */}
          <div className="mb-4">
            <label className="text-white text-sm mb-2 block">Survey URL:</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={surveyLink} 
                readOnly 
                className="flex-1 bg-black text-white border border-white rounded px-3 py-2"
              />
              <button 
                onClick={copyLink}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="flex flex-col items-center">
              <label className="text-white text-sm mb-2">QR Code:</label>
              <div className="bg-white p-2 rounded-lg mb-2">
                <img src={qrCode} alt="Survey QR Code" className="w-48 h-48" />
              </div>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'survey-qr-code.png';
                  link.href = qrCode;
                  link.click();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="border border-white rounded-lg overflow-hidden bg-white">
        <SurveyCreator 
          survey={surveyJson}
          onChange={handleSurveyChange}
          options={{
            showDesignerTab: true,
            showTestSurveyTab: true,
            showJSONEditorTab: true,
            showEmbededSurveyTab: true,
            showTranslationTab: false,
            showLogicTab: true,
            showDataTab: false,
            showOptionsTab: true,
            questionTypes: {
              text: true,
              comment: true,
              dropdown: true,
              checkbox: true,
              radiogroup: true,
              boolean: true,
              rating: true,
              matrix: true,
              matrixdropdown: true,
              matrixdynamic: true,
              multipletext: true,
              panel: true,
              paneldynamic: true,
              file: true,
              imagepicker: true,
              ranking: true,
              signaturepad: true,
              expression: true,
              image: true,
              html: true
            }
          }}
        />
      </div>
    </div>
  );
}
