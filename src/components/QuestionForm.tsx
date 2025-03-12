import { useState } from 'react';
import { Question } from '../types';

interface QuestionFormProps {
  question: Partial<Question>;
  onSave: (question: Question | Partial<Question>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const QuestionForm = ({ question, onSave, onCancel, isEditing = false }: QuestionFormProps) => {
  const [formData, setFormData] = useState<Partial<Question>>({ ...question });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const options = formData.options ? [...formData.options] : [];
    options[index] = value;
    setFormData({ ...formData, options });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: formData.options ? [...formData.options, ''] : [''],
    });
  };

  const handleSubmit = () => {
    onSave(formData as Question);
    if (!isEditing) setFormData({ type: 'short_answer', title: '', options: [] });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        value={formData.title || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
        placeholder="Título de la pregunta"
      />
      <select
        name="type"
        value={formData.type || 'short_answer'}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
      >
        <option value="short_answer">Respuesta Corta</option>
        <option value="multiple_choice">Opción Múltiple</option>
        <option value="multi_select">Selección Múltiple</option>
        
      </select>
      {(formData.type === 'multiple_choice' || formData.type === 'multi_select') && (
        <div className="space-y-2">
          {formData.options?.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt || ''}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              placeholder={`Opción ${index + 1}`}
            />
          ))}
          <button
            onClick={addOption}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-all"
          >
            + Agregar Opción
          </button>
        </div>
      )}
      <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white rounded-lg shadow-md transition-all"
        >
          {isEditing ? 'Guardar' : 'Agregar'}
        </button>
        {isEditing && onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-[#1F2937] rounded-lg transition-all"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};