// Toast.jsx
import { useEffect } from 'react';
export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 right-6 bg-black text-white px-6 py-3 rounded-2xl shadow-lg z-50">
      {message}
    </div>
  );
}
