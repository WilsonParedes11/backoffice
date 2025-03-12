// src/components/Forms.tsx (continuación)
import { Form } from '../types';
import { useState } from 'react';

interface FormCardProps {
  form: Form;
  onClick: (formId: string) => void;
  onDelete: (formId: string) => void;
  onUpdate: (formId: string, updatedData: Partial<Form>) => void;
}

export const FormCard = ({ form, onClick, onDelete, onUpdate }: FormCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: form.title, description: form.description || '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(form.id!, formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Título del formulario"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Descripción"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#1F2937] rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="cursor-pointer hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-white transition-all"
            onClick={() => onClick(form.id!)}
          >
            <h3 className="text-xl font-semibold text-[#1F2937]">{form.title}</h3>
            {form.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{form.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-3">
              Creado el: {new Date(form.created_at!).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(form.id!)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
};