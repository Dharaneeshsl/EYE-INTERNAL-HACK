// Certificates.jsx
import { useEffect, useState } from 'react';
import { fetchCertificates, uploadTemplate } from '../services/certificates';
import FieldMapping from '../components/certificates/FieldMapping';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Simulated fields for demo; replace with real API data
  const formFields = ['Name', 'Email', 'Score'];
  const pdfFields = ['Full Name', 'Email Address', 'Final Score'];
  const [fieldMap, setFieldMap] = useState({});

  useEffect(() => {
    fetchCertificates()
      .then(res => setCertificates(res.data || []))
      .catch(() => setToast('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadTemplate(file);
      setToast('Template uploaded!');
    } catch {
      setToast('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Certificate Management</h1>
      <div className="bg-black border-2 border-dashed border-white rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[200px] mb-8">
        <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="mb-4 text-white" />
        <button onClick={handleUpload} disabled={uploading || !file} className="bg-white text-black rounded-2xl px-4 py-2 font-semibold hover:bg-gray-200 border border-white transition-all">
          {uploading ? 'Uploading...' : 'Upload Template'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black border border-white rounded-2xl shadow p-6">
          <FieldMapping formFields={formFields} pdfFields={pdfFields} onMap={setFieldMap} />
        </div>
        <div className="bg-black border border-white rounded-2xl shadow p-6">
          <h2 className="font-bold mb-2 text-white">Certificate Preview</h2>
          <div className="h-32 flex items-center justify-center text-gray-400">PDF/Image Preview (coming soon)</div>
          <div className="mt-4 text-xs text-gray-400">Field Map: {JSON.stringify(fieldMap)}</div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Certificates</h2>
        <table className="w-full border border-white rounded-2xl overflow-hidden bg-black">
          <thead className="bg-black">
            <tr>
              <th className="border-b border-white px-4 py-2 text-left text-white">Name</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Form</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Status</th>
              <th className="border-b border-white px-4 py-2 text-left text-white">Created</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr key={cert._id} className="odd:bg-gray-900">
                <td className="border-b border-white px-4 py-2 text-white">{cert.name}</td>
                <td className="border-b border-white px-4 py-2 text-white">{cert.formId?.title || '-'}</td>
                <td className="border-b border-white px-4 py-2 text-white">{cert.sent ? '✓ Delivered' : '✗ Pending'}</td>
                <td className="border-b border-white px-4 py-2 text-white">{new Date(cert.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
