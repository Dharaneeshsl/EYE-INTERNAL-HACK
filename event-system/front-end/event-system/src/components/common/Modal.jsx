// Modal.jsx
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-black border border-white rounded-2xl shadow-lg p-8 min-w-[300px] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white font-bold">×</button>
        {children}
      </div>
    </div>
  );
}
