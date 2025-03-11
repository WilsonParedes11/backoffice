import { Form } from '../types';

interface FormCardProps {
  form: Form;
  isSelected: boolean;
  onClick: (formId: string) => void;
}

export const FormCard = ({ form, isSelected, onClick }: FormCardProps) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md transition-all cursor-pointer bg-white hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-white border ${
        isSelected ? 'border-[#3B82F6]' : 'border-gray-200'
      }`}
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
  );
};