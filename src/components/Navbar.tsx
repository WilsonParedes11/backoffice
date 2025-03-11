import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 bg-white text-gray-800 shadow-sm z-40">
      <div className="h-16 flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold tracking-tight text-gray-700">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;