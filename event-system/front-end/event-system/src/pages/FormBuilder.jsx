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
    getForms().then(res => setForms(res.data || [])).catch(() => setToast('Failed to load forms'));
  }, []);

  const handleSave = async (surveyJson) => {
    setLoading(true);
    try {
      await createForm({ title: surveyJson.title || 'Untitled', schema: surveyJson });
      setToast('Form saved!');
      const res = await getForms();
      setForms(res.data || []);
    } catch {
      setToast('Failed to save form');
    } finally {
      setLoading(false);
    }
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
        <SurveyBuilder onSave={handleSave} json={json} />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={() => setPreview(true)} className="bg-black text-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black border border-white transition-all">Preview</button>
        <button onClick={() => handleSave(json)} disabled={loading} className="bg-black text-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black border border-white transition-all">{loading ? 'Saving...' : 'Publish'}</button>
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
        <div className="w-[400px]">
          <h2 className="text-xl font-bold mb-4">Form Preview</h2>
          {/* TODO: Integrate SurveyForm for preview */}
          <div className="text-gray-400">Preview coming soon...</div>
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
