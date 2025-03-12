import { Question} from '../types';

interface QuestionEditorProps {
  newQuestion: Partial<Question>;
  onQuestionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onAddQuestion: () => void;
}

export const QuestionEditor = ({
  newQuestion,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onAddQuestion,
}: QuestionEditorProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label htmlFor="questionTitle" className="text-sm font-medium text-[#1F2937]">
          Título de la Pregunta
        </label>
        <input
          id="questionTitle"
          name="title"
          type="text"
          value={newQuestion.title || ''}
          onChange={onQuestionChange}
          className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
          placeholder="Escribe la pregunta"
        />
      </div>
      <div>
        <label htmlFor="questionType" className="text-sm font-medium text-[#1F2937]">
          Tipo de Pregunta
        </label>
        <select
          id="questionType"
          name="type"
          value={newQuestion.type || 'short_answer'}
          onChange={onQuestionChange}
          className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
        >
          <option value="short_answer">Respuesta Corta</option>
          <option value="multiple_choice">Opción Múltiple</option>
          <option value="multi_select">Selección Múltiple</option>
         
        </select>
      </div>
      {(newQuestion.type === 'multiple_choice' || newQuestion.type === 'multi_select') && (
        <div>
          <label className="text-sm font-medium text-[#1F2937]">Opciones</label>
          {newQuestion.options?.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt || ''}
              onChange={(e) => onOptionChange(index, e.target.value)}
              className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
              placeholder={`Opción ${index + 1}`}
            />
          ))}
          <button
            onClick={onAddOption}
            className="mt-2 px-3 py-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md text-sm transition-all"
          >
            + Agregar Opción
          </button>
        </div>
      )}
      <button
        onClick={onAddQuestion}
        className="mt-4 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-all"
      >
        Agregar Pregunta
      </button>
    </div>
  );
};