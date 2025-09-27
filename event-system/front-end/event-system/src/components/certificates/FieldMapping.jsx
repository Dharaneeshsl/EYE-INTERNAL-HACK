// FieldMapping.jsx
import { useState } from 'react';

export default function FieldMapping({ formFields, pdfFields, onMap }) {
  const [mapping, setMapping] = useState({});

  const handleChange = (pdfField, e) => {
    const value = e.target.value;
    setMapping(m => ({ ...m, [pdfField]: value }));
    onMap({ ...mapping, [pdfField]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold mb-2 text-white">Map Form Fields to Certificate Placeholders</h3>
      {pdfFields.map(pdfField => (
        <div key={pdfField} className="flex items-center gap-4">
          <span className="w-40 text-white">{pdfField}</span>
          <select
            className="border border-white rounded px-2 py-1 bg-black text-white"
            value={mapping[pdfField] || ''}
            onChange={e => handleChange(pdfField, e)}
          >
            <option value="">Select form field</option>
            {formFields.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
