// FormBuilder.jsx
import React, { useState, useEffect } from 'react';
import SurveyBuilder from '../components/forms/SurveyBuilder';
import Modal from '../components/common/Modal';
import { getForms, createForm } from '../services/api';
import Toast from '../components/common/Toast';

export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [json, setJson] = useState({});
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getForms().then(res => setForms(res.data || [])).catch(() => setToast('Failed to load forms'));
  }, []);

  const handleSave = async (surveyJson) => {
    setLoading(true);
    try {
      const formData = {
        title: surveyJson.title || 'Untitled',
        description: surveyJson.description || '',
        questions: surveyJson.pages || [],
        settings: {
          requiresLogin: false,
          isAnonymous: true,
          allowMultipleResponses: true,
          isActive: true
        }
      };
      
      await createForm(formData);
      setToast('Form saved successfully!');
      const res = await getForms();
      setForms(res.data || []);
    } catch (error) {
      console.error('Save error:', error);
      setToast('Failed to save form: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Form Builder</h1>
      <div className="bg-black border border-white rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[300px] w-full">
        <SurveyBuilder onSave={handleSave} json={json} />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={() => setPreview(true)} className="bg-black text-white border border-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black transition-all">Preview</button>
        <button onClick={() => handleSave(json)} disabled={loading} className="bg-black text-white border border-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black transition-all">{loading ? 'Saving...' : 'Publish'}</button>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-white">Created Forms</h2>
        <table className="w-full border border-white rounded-2xl overflow-hidden bg-black">
          <thead className="bg-black">
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
                  <button className="bg-black text-white border border-white rounded px-2 py-1 hover:bg-white hover:text-black">View</button>
                  <button className="bg-black text-white border border-white rounded px-2 py-1 hover:bg-white hover:text-black">Edit</button>
                  <button className="bg-black text-white border border-white rounded px-2 py-1 hover:bg-white hover:text-black">Delete</button>
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
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
