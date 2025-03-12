import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Form, Question, QuestionType } from '../types';

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los formularios al montar el hook
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('No se pudo obtener el usuario autenticado');

        const { data, error } = await supabase
          .from('forms')
          .select('id, title, description, created_at, admin_id')
          .eq('admin_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setForms(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  // Función para cargar preguntas de un formulario específico
  const fetchQuestions = async (formId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('id, form_id, type, title, options, created_at')
        .eq('form_id', formId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError((err as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (formId: string, question: Partial<Question>) => {
    if (!question.title) {
      setError('El título de la pregunta es obligatorio');
      return Promise.reject(new Error('El título de la pregunta es obligatorio'));
    }

    try {
      const questionData: Question = {
        form_id: formId,
        type: question.type as QuestionType,
        title: question.title,
        options: question.options && question.options.length > 0 ? question.options : undefined,
      };

      const { data, error } = await supabase
        .from('questions')
        .insert(questionData)
        .select()
        .single();

      if (error) throw error;

      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, questions: [...(f.questions || []), data] } : f))
      );
      setError(null);
      return Promise.resolve(data);
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  const updateQuestion = async (question: Question) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          title: question.title,
          type: question.type,
          options: question.options && question.options.length > 0 ? question.options : null,
        })
        .eq('id', question.id);

      if (error) throw error;

      setForms((prev) =>
        prev.map((f) =>
          f.id === question.form_id
            ? {
                ...f,
                questions: (f.questions || []).map((q) => (q.id === question.id ? question : q)),
              }
            : f
        )
      );
      setError(null);
      return Promise.resolve();
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  const deleteQuestion = async (questionId: string, formId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) {
      return Promise.resolve();
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setForms((prev) =>
        prev.map((f) =>
          f.id === formId
            ? { ...f, questions: (f.questions || []).filter((q) => q.id !== questionId) }
            : f
        )
      );
      setError(null);
      return Promise.resolve();
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  const addForm = async (formData: Partial<Form>) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No se pudo obtener el usuario autenticado');

      const newForm: Partial<Form> = {
        admin_id: user.id,
        title: formData.title || 'Formulario sin título',
        description: formData.description,
      };

      const { data, error } = await supabase
        .from('forms')
        .insert(newForm)
        .select()
        .single();

      if (error) throw error;

      setForms((prev) => [...prev, data]);
      setError(null);
      return Promise.resolve(data);
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  const updateForm = async (formId: string, updatedData: Partial<Form>) => {
    try {
      const { error } = await supabase
        .from('forms')
        .update({
          title: updatedData.title,
          description: updatedData.description,
        })
        .eq('id', formId);

      if (error) throw error;

      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, ...updatedData } : f))
      );
      setError(null);
      return Promise.resolve();
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  const deleteForm = async (formId: string) => {
    if (!confirm('¿Estás seguro de eliminar este formulario?')) {
      return Promise.resolve();
    }

    try {
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('form_id', formId);

      if (questionsError) throw questionsError;

      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;

      setForms((prev) => prev.filter((f) => f.id !== formId));
      setError(null);
      return Promise.resolve();
    } catch (err) {
      setError((err as Error).message);
      return Promise.reject(err);
    }
  };

  return {
    forms,
    loading,
    error,
    fetchQuestions, // Nueva función para cargar preguntas dinámicamente
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addForm,
    updateForm,
    deleteForm,
    setError,
  };
};