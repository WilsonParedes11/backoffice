import { NavLink } from 'react-router-dom';
import { Home, FileText, PlusCircle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/forms', label: 'Formularios', icon: <FileText className="w-5 h-5" /> },
    { path: '/create-form', label: 'Crear Formulario', icon: <PlusCircle className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-100 text-gray-800 shadow-sm transform md:translate-x-0 -translate-x-full md:static transition-transform duration-300 ease-in-out z-50">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h2 className="text-xl font-semibold tracking-wide text-gray-700">Backoffice</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gray-200 text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`
            }
          >
            {item.icon}
            <span className="ml-3 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;