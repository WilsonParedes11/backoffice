import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';

// Definir el tipo para las props
interface ProtectedRouteProps {
  children: React.ReactNode; // Usamos React.ReactNode en lugar de JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null); // En producción, tipa esto con un tipo específico
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup de la suscripción
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;