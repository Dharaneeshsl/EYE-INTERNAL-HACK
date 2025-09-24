// Sidebar.jsx
// Black sidebar with white text, nav links, and active state
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Forms', path: '/forms' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Settings', path: '/settings' },
  { name: 'Logout', path: '/login' },
];

export default function Sidebar({ darkMode }) {
  return (
    <aside className={`w-64 min-h-screen bg-black text-white flex flex-col py-8 px-4 border-r border-gray-800`}>  
      <div className="text-2xl font-bold mb-10 tracking-wide">Event System</div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 font-semibold transition-all border border-transparent ${
                isActive ? 'bg-white text-black border-black' : 'hover:bg-white hover:text-black'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
