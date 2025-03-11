// src/hooks/useForms.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Form, Question, QuestionType } from '../types';

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedFormQuestions, setSelectedFormQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('No se pudo obtener el usuario autenticado');

        const { data, error } = await supabase
          .from('forms')
          .select('id, title, description, created_at')
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

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedFormId) {
        setSelectedFormQuestions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('questions')
          .select('id, type, title, options')
          .eq('form_id', selectedFormId);

        if (error) throw error;
        setSelectedFormQuestions(data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchQuestions();
  }, [selectedFormId]);

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

      setSelectedFormQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? question : q))
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setSelectedFormQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const addQuestion = async (formId: string, question: Partial<Question>) => {
    if (!question.title) {
      setError('El título de la pregunta es obligatorio');
      return;
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

      setSelectedFormQuestions((prev) => [...prev, data]);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    forms,
    loading,
    error,
    selectedFormId,
    setSelectedFormId,
    selectedFormQuestions,
    updateQuestion,
    deleteQuestion,
    addQuestion,
    setError,
  };
};