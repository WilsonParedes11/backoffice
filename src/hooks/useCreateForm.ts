import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Form, Question, QuestionType } from '../types';

export const useCreateForm = () => {
  const [form, setForm] = useState<Partial<Form>>({ title: '', description: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'short_answer',
    title: '',
    options: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion((prev) => {
      const options = prev.options ? [...prev.options] : [];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options ? [...prev.options, ''] : [''],
    }));
  };

  const addQuestion = () => {
    if (!newQuestion.title) {
      setError('El título de la pregunta es obligatorio');
      return;
    }
    setQuestions((prev) => [
      ...prev,
      { ...newQuestion, type: newQuestion.type as QuestionType } as Question,
    ]);
    setNewQuestion({ type: 'short_answer', title: '', options: [] });
    setError(null);
  };

  const handleSubmit = async () => {
    if (!form.title) {
      setError('El título del formulario es obligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No se pudo obtener el usuario autenticado');

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();
      if (adminError || !adminData) {
        throw new Error('El usuario no está registrado como administrador');
      }

      const formData: Form = {
        admin_id: user.id,
        title: form.title,
        description: form.description || undefined,
      };
      const { data: formResponse, error: formError } = await supabase
        .from('forms')
        .insert(formData)
        .select()
        .single();
      if (formError) throw formError;

      if (questions.length > 0) {
        const questionsData: Question[] = questions.map((q) => ({
          form_id: formResponse.id,
          type: q.type,
          title: q.title,
          options: q.options && q.options.length > 0 ? q.options : undefined,
        }));
        const { error: questionsError } = await supabase.from('questions').insert(questionsData);
        if (questionsError) throw questionsError;
      }

      navigate('/forms');
    } catch (err) {
      console.error('Error al guardar formulario:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    questions,
    newQuestion,
    error,
    isLoading,
    handleInputChange,
    handleQuestionChange,
    handleOptionChange,
    addOption,
    addQuestion,
    handleSubmit,
  };
};