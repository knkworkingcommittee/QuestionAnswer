
// These are types that can be used when connecting to Supabase
// This file is optional and serves as a reference

export interface QuestionRow {
  id: string;
  name: string;
  question: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: QuestionRow;
        Insert: Omit<QuestionRow, 'id' | 'created_at'>;
        Update: Partial<Omit<QuestionRow, 'id' | 'created_at'>>;
      };
    };
  };
}
