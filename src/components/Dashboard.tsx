// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { supabase } from '../lib/supabase';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface Stat {
  label: string;
  value: string;
  change: string;
}

interface FormStats {
  month: string;
  count: number;
}

interface ActivityStats {
  week: string;
  formsCreated: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [formStats, setFormStats] = useState<FormStats[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Obtener formularios activos
        const { data: formsData, error: formsError } = await supabase
          .from('forms')
          .select('id, created_at', { count: 'exact' });
        if (formsError) throw formsError;

        // Obtener usuarios registrados (admins)
        const { data: adminsData, error: adminsError } = await supabase
          .from('admins')
          .select('id', { count: 'exact' });
        if (adminsError) throw adminsError;

        // Calcular cambios (ejemplo simple, puedes ajustar la lógica)
        const formsThisWeek = formsData.filter((form) => {
          const createdAt = new Date(form.created_at);
          const now = new Date();
          const diff = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
          return diff <= 7;
        }).length;

        // Estadísticas básicas
        setStats([
          { label: 'Formularios Activos', value: formsData.length.toString(), change: `+${formsThisWeek} esta semana` },
          { label: 'Usuarios Registrados', value: adminsData.length.toString(), change: 'Sin cambios' },
        ]);

        // Datos para gráfico de barras (formularios por mes)
        const formsByMonth = formsData.reduce((acc: { [key: string]: number }, form) => {
          const month = new Date(form.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const formStatsData: FormStats[] = Object.entries(formsByMonth).map(([month, count]) => ({
          month,
          count,
        }));
        setFormStats(formStatsData);

        // Datos para gráfico lineal (actividad semanal simulada)
        const weeks = Array(4).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i * 7);
          return date.toLocaleString('default', { month: 'short', day: 'numeric' });
        }).reverse();

        const activityByWeek = weeks.map((week) => {
          const formsInWeek = formsData.filter((form) => {
            const createdAt = new Date(form.created_at);
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 28); // Últimas 4 semanas
            return createdAt >= weekStart && createdAt.toLocaleString('default', { month: 'short', day: 'numeric' }) === week;
          }).length;
          return { week, formsCreated: formsInWeek };
        });
        setActivityStats(activityByWeek);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Configuración del gráfico de barras
  const barData = {
    labels: formStats.map((stat) => stat.month),
    datasets: [
      {
        label: 'Formularios Creados',
        data: formStats.map((stat) => stat.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Formularios Creados por Mes' },
    },
  };

  // Configuración del gráfico lineal
  const lineData = {
    labels: activityStats.map((stat) => stat.week),
    datasets: [
      {
        label: 'Formularios Creados',
        data: activityStats.map((stat) => stat.formsCreated),
        fill: false,
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Actividad Semanal' },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 mt-16 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Estadísticas</h2>

          {loading && <p className="text-gray-500">Cargando datos...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              {/* Estadísticas básicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-700">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Bar data={barData} options={barOptions} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;