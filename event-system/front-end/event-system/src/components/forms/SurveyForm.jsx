// SurveyForm.jsx
import React, { useState, useEffect } from 'react';
import { Survey } from 'survey-react-ui';

export default function SurveyForm({ json, onComplete }) {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (json) {
        setSurvey(json);
        setError('');
      } else {
        setError('No survey data provided');
      }
    } catch (err) {
      setError('Error loading survey: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [json]);

  const handleComplete = (survey) => {
    try {
      if (onComplete) {
        onComplete(survey);
      }
    } catch (err) {
      setError('Error submitting survey: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-600">No survey available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <Survey 
          json={survey} 
          onComplete={handleComplete}
          css={{
            root: "sv_main sv_default_css",
            container: "sv_container",
            header: "sv_header",
            body: "sv_body",
            footer: "sv_footer"
          }}
        />
      </div>
    </div>
  );
}
