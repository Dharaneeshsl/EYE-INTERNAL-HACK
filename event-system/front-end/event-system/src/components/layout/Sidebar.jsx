// Sidebar.jsx
// Black sidebar with white text, nav links, and active state
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Forms', path: '/forms' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Events', path: '/events' },
];

export default function Sidebar({ darkMode }) {
  return (
    <aside className={`w-64 min-h-screen ${darkMode ? 'bg-black text-white border-white' : 'bg-white text-black border-black'} flex flex-col py-8 px-6 border-r shadow-xl`}>  
      <div className={`text-2xl font-bold mb-12 tracking-wide text-center ${darkMode ? 'text-white' : 'text-black'}`}>
        Event System
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 font-semibold text-base transition-all duration-300 border flex items-center gap-3 ${
                darkMode 
                  ? `border-white ${isActive 
                      ? 'bg-white text-black shadow-lg transform scale-105' 
                      : 'hover:bg-white hover:text-black hover:transform hover:scale-105'}`
                  : `border-black ${isActive 
                      ? 'bg-black text-white shadow-lg transform scale-105' 
                      : 'hover:bg-black hover:text-white hover:transform hover:scale-105'}`
              }`
            }
          >
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className={`mt-auto pt-6 border-t ${darkMode ? 'border-white' : 'border-black'}`}>
        <div className={`text-center text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
          <div className="mb-2">✨ Event Management</div>
          
        </div>
      </div>
    </aside>
  );
}
