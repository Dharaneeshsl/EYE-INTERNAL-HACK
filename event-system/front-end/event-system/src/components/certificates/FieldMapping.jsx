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
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white mb-2">Map Form Fields to Certificate Placeholders</h4>
        <p className="text-sm text-gray-300">Connect your form data to certificate template fields</p>
      </div>
      {pdfFields.map((pdfField, index) => (
        <div key={pdfField} className="bg-black rounded-lg p-4 border border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold mr-3">
                {index + 1}
              </div>
              <span className="text-white font-medium">{pdfField}</span>
            </div>
            <select
              className="bg-black border border-white rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white min-w-[200px]"
              value={mapping[pdfField] || ''}
              onChange={e => handleChange(pdfField, e)}
            >
              <option value="">Select form field</option>
              {formFields.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          {mapping[pdfField] && (
            <div className="mt-2 text-sm text-white">
              ✅ Mapped to: <span className="font-semibold">{mapping[pdfField]}</span>
            </div>
          )}
        </div>
      ))}
      <div className="mt-6 p-4 bg-black rounded-lg border border-white">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Mapping Progress:</span>
          <span className="text-white font-semibold">
            {Object.keys(mapping).filter(key => mapping[key]).length} / {pdfFields.length} mapped
          </span>
        </div>
        <div className="mt-2 w-full bg-black border border-white rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(mapping).filter(key => mapping[key]).length / pdfFields.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
