// Header.jsx
// White header with black text, app title, user profile, and dark mode toggle

export default function Header({ darkMode, toggleDarkMode, user, logout }) {
  return (
    <header className="w-full bg-white text-black flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <div className="text-xl font-bold tracking-wide">Analytics Dashboard</div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="rounded-2xl border border-black px-4 py-2 bg-black text-white hover:bg-white hover:text-black transition-all font-semibold"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.name || user.email}</span>
            <button onClick={logout} className="ml-2 px-3 py-1 rounded-2xl border border-black bg-black text-white hover:bg-white hover:text-black transition-all text-sm">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
