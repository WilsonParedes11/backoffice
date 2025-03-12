import { Question } from '../types';
import { QuestionForm } from './QuestionForm';
import { useState } from 'react';

interface QuestionListProps {
  questions: Question[];
  onUpdate: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onAdd: (question: Partial<Question>) => void;
}

export const QuestionList = ({ questions, onUpdate, onDelete, onAdd }: QuestionListProps) => {
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  return (
    <div className="space-y-6">
      {questions.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay preguntas en este formulario.</p>
      ) : (
        questions.map((question) => (
          <div
            key={question.id}
            className="p-5 bg-white rounded-2xl shadow-md border border-gray-200"
          >
            {editingQuestion?.id === question.id ? (
              <QuestionForm
                question={editingQuestion}
                onSave={(question) => onUpdate(question as Question)}
                onCancel={() => setEditingQuestion(null)}
                isEditing
              />
            ) : (
              <div>
                <p className="text-md font-medium text-[#1F2937]">{question.title}</p>
                <p className="text-xs text-gray-500 mt-1">Tipo: {question.type}</p>
                {question.options && (
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    {question.options.map((opt, i) => (
                      <li key={i}>- {opt}</li>
                    ))}
                  </ul>
                )}
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg shadow-md transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(question.id!)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
      <div className="p-5 bg-white rounded-2xl shadow-md border border-gray-200">
        <h5 className="text-md font-semibold text-[#1F2937] mb-4">Agregar Nueva Pregunta</h5>
        <QuestionForm question={{ type: 'short_answer', title: '', options: [] }} onSave={onAdd} />
      </div>
    </div>
  );
};