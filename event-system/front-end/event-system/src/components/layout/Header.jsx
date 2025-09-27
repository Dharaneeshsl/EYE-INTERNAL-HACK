// Header.jsx
// White header with black text, app title, user profile, and dark mode toggle

export default function Header({ darkMode, toggleDarkMode, user, logout }) {
  return (
    <header className="w-full bg-black text-white flex items-center justify-between px-8 py-4 border-b border-white">
      <div className="text-xl font-bold tracking-wide">Analytics Dashboard</div>
      <div className="flex items-center gap-4">
        {/* Dark mode toggle disabled since we enforce dark globally */}
        {user && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.name || user.email}</span>
            <button onClick={logout} className="ml-2 px-3 py-1 rounded-2xl border border-white bg-white text-black hover:bg-gray-200 transition-all text-sm">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
