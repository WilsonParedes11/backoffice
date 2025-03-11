import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Dashboard = () => {
  const stats = [
    { label: 'Formularios Activos', value: '12', change: '+2 esta semana' },
    { label: 'Respuestas Totales', value: '245', change: '+15 hoy' },
    { label: 'Usuarios Registrados', value: '8', change: 'Sin cambios' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 mt-16 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                <p className="text-3xl font-bold mt-2 text-gray-700">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;