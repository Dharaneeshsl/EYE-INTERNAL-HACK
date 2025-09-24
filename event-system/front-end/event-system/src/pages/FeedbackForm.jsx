// FeedbackForm.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SurveyForm from '../components/forms/SurveyForm';
import { fetchFormById } from '../services/forms';
import { submitFeedback } from '../services/feedback';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';

export default function FeedbackForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchFormById(formId)
      .then(setForm)
      .catch(() => setToast('Failed to load form'))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleComplete = async (data) => {
    try {
      await submitFeedback(formId, data.data);
      setSubmitted(true);
    } catch {
      setToast('Submission failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white border border-black rounded-2xl shadow-lg p-10 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Event Feedback</h2>
        {!submitted ? (
          <>
            {form && form.schema ? (
              <SurveyForm json={form.schema} onComplete={handleComplete} />
            ) : (
              <div className="mb-6 text-gray-400 text-center">Form not found or invalid.</div>
            )}
          </>
        ) : (
          <div className="mt-6 text-center text-green-700 font-semibold">Thank you for your feedback! Your certificate will be sent via email.</div>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
