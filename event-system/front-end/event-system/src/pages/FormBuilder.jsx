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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <div className="bg-white border border-black rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[300px] w-full">
        <SurveyBuilder onSave={handleSave} json={json} />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={() => setPreview(true)} className="bg-black text-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">Preview</button>
        <button onClick={() => handleSave(json)} disabled={loading} className="bg-black text-white rounded-2xl px-6 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">{loading ? 'Saving...' : 'Publish'}</button>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Created Forms</h2>
        <table className="w-full border border-black rounded-2xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-black px-4 py-2 text-left">Form Name</th>
              <th className="border-b border-black px-4 py-2 text-left">Created Date</th>
              <th className="border-b border-black px-4 py-2 text-left">Responses</th>
              <th className="border-b border-black px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form._id} className="odd:bg-gray-50">
                <td className="border-b border-black px-4 py-2">{form.title}</td>
                <td className="border-b border-black px-4 py-2">{new Date(form.createdAt).toLocaleDateString()}</td>
                <td className="border-b border-black px-4 py-2">{form.responseCount || 0}</td>
                <td className="border-b border-black px-4 py-2 flex gap-2">
                  <button className="border border-black rounded px-2 py-1">View</button>
                  <button className="border border-black rounded px-2 py-1">Edit</button>
                  <button className="border border-black rounded px-2 py-1">Delete</button>
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
