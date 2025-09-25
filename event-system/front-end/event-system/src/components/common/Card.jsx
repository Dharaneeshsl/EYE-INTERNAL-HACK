// Card.jsx
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-black border border-gray-800 rounded-2xl shadow p-6 text-white ${className}`}>
      {children}
    </div>
  );
}
