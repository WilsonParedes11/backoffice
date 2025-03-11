import Sidebar from './Sidebar';
import Navbar from './Navbar';

const CreateForm = () => (
  <div className="flex min-h-screen bg-zinc-50">
    <Sidebar />
    <div className="flex-1 flex flex-col md:ml-64">
      <Navbar />
      <main className="flex-1 p-6 mt-16">
        <h2 className="text-2xl font-semibold text-zinc-800">Crear Formulario</h2>
        <p className="text-zinc-600 mt-2">Aquí irá el formulario de creación.</p>
      </main>
    </div>
  </div>
);

export default CreateForm;