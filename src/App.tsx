import { useState } from 'react';
import viteLogo from '/vite.svg'; 
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState<number>(0); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex gap-4 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo w-16 h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react w-16 h-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Vite + React Backoffice</h1>
      <div className="card bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-6 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;