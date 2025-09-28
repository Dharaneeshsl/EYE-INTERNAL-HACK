// FormBuilder.jsx
import React, { useState, useEffect } from 'react';
import SurveyBuilder from '../components/forms/SurveyBuilder';
import Modal from '../components/common/Modal';
import { getForms, createForm, getFormQRCode, getFormById, updateForm, deleteForm } from '../services/api';
import Toast from '../components/common/Toast';

export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [json, setJson] = useState({});
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    // Test backend connection first
    fetch('http://localhost:5000/api/forms', { 
      credentials: 'include',
      method: 'GET'
    })
    .then(res => {
      console.log('Backend connection test:', res.status, res.statusText);
      if (!res.ok) {
        throw new Error(`Backend not responding: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Backend response:', data);
      setForms(data.data || []);
    })
    .catch(error => {
      console.error('Backend connection failed:', error);
      setToast('Backend server not running! Please start the backend server on port 5000');
    });
  }, []);

  const handleSave = async (surveyJson) => {
    setLoading(true);
    try {
      console.log('Saving form:', surveyJson);
      
      const formData = {
        title: surveyJson.title || 'Untitled Form', 
        description: surveyJson.description || '',
        questions: surveyJson.pages?.[0]?.elements || [],
        settings: {
          requiresLogin: false,
          isAnonymous: true,
          allowMultipleResponses: true,
          isActive: true
        }
      };
      
      console.log('Form data being sent:', formData);
      
      const response = await createForm(formData);
      console.log('Form saved successfully:', response);
      
      setToast('Form saved successfully!');
      const res = await getForms();
      setForms(res.data || []);
    } catch (error) {
      console.error('Error saving form:', error);
      console.error('Error details:', error.message, error.stack);
      setToast('Failed to save form: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormUpdate = (surveyJson) => {
    console.log('Form updated:', surveyJson);
    setJson(surveyJson);
  };

  const handleCopyLink = async (formId) => {
    try {
      const form = await getFormById(formId);
      const formUrl = `${window.location.origin}/feedback/${formId}`;
      await navigator.clipboard.writeText(formUrl);
      setToast('Link copied to clipboard!');
    } catch {
      setToast('Failed to copy link');
    }
  };

  const handleGenerateQR = async (formId) => {
    try {
      const response = await getFormQRCode(formId);
      setQrData(response.data);
      setSelectedForm(formId);
      setQrModal(true);
    } catch {
      setToast('Failed to generate QR code');
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
        setToast('Form deleted successfully!');
        const res = await getForms();
        setForms(res.data || []);
      } catch {
        setToast('Failed to delete form');
      }
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <div className="bg-black border border-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[300px] w-full">
        <SurveyBuilder onSave={handleFormUpdate} json={json} />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={() => setPreview(true)} className="bg-black text-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black border border-white transition-all">Preview</button>
        <div className="text-gray-400 text-sm flex items-center">
          💡 Use the "Save Form" button in the form builder above to publish your form
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Created Forms</h2>
        <table className="w-full border border-white rounded-2xl overflow-hidden bg-black">
          <thead className="bg-gray-800">
            <tr>
              <th className="border-b border-white px-4 py-2 text-left text-white">Form Name</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Created Date</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Responses</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form._id} className="odd:bg-gray-900">
                <td className="border-b border-white px-4 py-2 text-white">{form.title}</td>
                <td className="border-b border-white px-4 py-2 text-white">{new Date(form.createdAt).toLocaleDateString()}</td>
                <td className="border-b border-white px-4 py-2 text-white">{form.responseCount || 0}</td>
                <td className="border-b border-white px-4 py-2 flex gap-2">
                  <button 
                    onClick={() => handleCopyLink(form._id)}
                    className="border border-white rounded px-2 py-1 text-white hover:bg-white hover:text-black transition-all text-xs"
                  >
                    📋 Copy Link
                  </button>
                  <button 
                    onClick={() => handleGenerateQR(form._id)}
                    className="border border-white rounded px-2 py-1 text-white hover:bg-white hover:text-black transition-all text-xs"
                  >
                    📱 QR Code
                  </button>
                  <button 
                    onClick={() => handleDeleteForm(form._id)}
                    className="border border-red-500 rounded px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={preview} onClose={() => setPreview(false)}>
        <div className="w-[600px] bg-black border border-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Form Preview</h2>
          {Object.keys(json).length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gray-800 border border-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{json.title || 'Untitled Form'}</h3>
                {json.description && (
                  <p className="text-gray-300 text-sm mb-4">{json.description}</p>
                )}
                <div className="space-y-3">
                  {json.pages?.[0]?.elements?.map((element, index) => (
                    <div key={index} className="bg-gray-700 border border-gray-600 rounded p-3">
                      <div className="text-white font-medium mb-2">
                        {index + 1}. {element.title || 'Untitled Question'}
                        {element.isRequired && <span className="text-red-400 ml-1">*</span>}
                      </div>
                      <div className="text-gray-300 text-sm mb-2">
                        Type: {element.type}
                      </div>
                      {element.choices && (
                        <div className="text-gray-400 text-sm">
                          Options: {element.choices.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => setPreview(false)}
                  className="bg-white text-black rounded-lg px-4 py-2 font-semibold hover:bg-gray-200 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">📝</div>
              <p>No form created yet. Build your form first!</p>
            </div>
          )}
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal open={qrModal} onClose={() => setQrModal(false)}>
        <div className="w-[400px] bg-black border border-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white text-center">QR Code</h2>
          {qrData && (
            <div className="text-center">
              <img src={qrData.qrCode} alt="QR Code" className="mx-auto mb-4 border border-white rounded-lg" />
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Form URL:</label>
                <div className="bg-gray-800 border border-white rounded p-2 text-white text-sm break-all">
                  {qrData.url}
                </div>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(qrData.url)}
                className="bg-white text-black rounded-lg px-4 py-2 font-semibold hover:bg-gray-200 transition-all"
              >
                📋 Copy URL
              </button>
            </div>
          )}
        </div>
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
