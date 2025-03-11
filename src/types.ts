export interface Form {
    id?: string;
    admin_id: string;
    title: string;
    description?: string;
    created_at?: string;
    questions?: Question[]; // Relación opcional para incluir preguntas
  }
  
  export type QuestionType = 'multiple_choice' | 'multi_select' | 'short_answer' | 'true_false';
  
  export interface Question {
    id?: string;
    form_id: string;
    type: QuestionType;
    title: string;
    options?: string[];
    created_at?: string;
  }