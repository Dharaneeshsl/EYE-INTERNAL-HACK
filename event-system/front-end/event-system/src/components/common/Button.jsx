// Button.jsx
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-black text-white rounded-2xl px-4 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
