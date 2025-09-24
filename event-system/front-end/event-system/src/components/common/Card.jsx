// Card.jsx
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-black rounded-2xl shadow p-6 ${className}`}>
      {children}
    </div>
  );
}
