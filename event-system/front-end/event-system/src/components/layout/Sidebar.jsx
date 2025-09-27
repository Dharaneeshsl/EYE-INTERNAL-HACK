// Sidebar.jsx
// Black sidebar with white text, nav links, and active state
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Forms', path: '/forms', icon: '📝' },
  { name: 'Certificates', path: '/certificates', icon: '🏆' },
];

export default function Sidebar({ darkMode }) {
  return (
    <aside className={`w-64 min-h-screen bg-black text-white flex flex-col py-8 px-6 border-r border-white shadow-xl`}>  
      <div className="text-2xl font-bold mb-12 tracking-wide text-center text-white">
        Event System
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 font-semibold text-base transition-all duration-300 border border-white flex items-center gap-3 ${
                isActive 
                  ? 'bg-white text-black shadow-lg transform scale-105' 
                  : 'hover:bg-white hover:text-black hover:transform hover:scale-105'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white">
        <div className="text-center text-sm text-white">
          <div className="mb-2">✨ Event Management</div>
          
        </div>
      </div>
    </aside>
  );
}
