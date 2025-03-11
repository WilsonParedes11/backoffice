import { Form } from '../types';

interface FormDetailsProps {
  form: Partial<Form>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormDetails = ({ form, onChange }: FormDetailsProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-[#1F2937]">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title || ''}
            onChange={onChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            placeholder="Título del formulario"
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium text-[#1F2937]">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description || ''}
            onChange={onChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            placeholder="Descripción del formulario"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};