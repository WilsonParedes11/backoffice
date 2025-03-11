import { useState } from 'react';
import { supabase } from '../lib/supabase';
import authImage from '../assets/logo.png';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para registrar un nuevo administrador
  const handleRegister = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error('Error en signUp:', error);
        throw error;
      }
      if (!data.user) throw new Error('No se pudo obtener el usuario registrado');
  
      setEmail('');
      setPassword('');
      setIsRegistering(false);
      alert('Registro exitoso. Por favor, revisa tu correo para confirmar tu cuenta.');
    } catch (err) {
      console.error('Error completo:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para iniciar sesión
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setEmail('');
      setPassword('');
      alert('Inicio de sesión exitoso');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 ">
      <div className="w-full max-w-md mx-4 overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Imagen superior en diseño minimalista */}
        <div className="relative h-36 bg-zinc-100 flex items-center justify-center">
          <img
            src={authImage}
            alt="Authentication"
            className="object-cover w-24 h-24 mx-auto"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-2xl font-medium text-white">
              {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
          </div>
        </div>

        {/* Formulario con diseño minimalista */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-zinc-300 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-zinc-300 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="py-2 px-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={isRegistering ? handleRegister : handleLogin}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <span>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</span>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all"
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;