import { Question } from '../types';

interface QuestionPreviewListProps {
  questions: Question[];
}

export const QuestionPreviewList = ({ questions }: QuestionPreviewListProps) => {
  return (
    <div>
      {questions.map((q, index) => (
        <div key={index} className="p-4 border-b border-gray-200">
          <p className="text-sm font-medium text-[#1F2937]">{q.title}</p>
          <p className="text-xs text-gray-500">Tipo: {q.type}</p>
          {q.options && (
            <ul className="text-xs text-gray-500 mt-1">
              {q.options.map((opt, i) => (
                <li key={i}>- {opt}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};