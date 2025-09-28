// Header.jsx
// White header with black text, app title, user profile, and dark mode toggle

export default function Header({ darkMode, user, logout }) {
  return (
    <header className={`w-full ${darkMode ? 'bg-black text-white border-white' : 'bg-white text-black border-black'} flex items-center justify-between px-8 py-4 border-b`}>
      <div className="text-xl font-bold tracking-wide">Analytics Dashboard</div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.name || user.email}</span>
            <button 
              onClick={logout} 
              className={`ml-2 px-3 py-1 rounded-2xl border transition-all text-sm ${
                darkMode 
                  ? 'border-white bg-white text-black hover:bg-gray-200' 
                  : 'border-black bg-black text-white hover:bg-gray-800'
              }`}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
