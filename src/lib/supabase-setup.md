
# Supabase Setup Guide

## 1. Create a Questions Table

When you connect to Supabase, you'll need to create a table for storing questions. You can use the SQL below:

```sql
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access" 
  ON public.questions FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous inserts" 
  ON public.questions FOR INSERT 
  WITH CHECK (true);
```

## 2. Connecting to Supabase

To connect to Supabase, you'll need to:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Integrate Supabase with Lovable using the Supabase integration in the top right menu
4. Or manually integrate using your own client code

## 3. Example Code for Manual Integration

If you choose to manually integrate with Supabase, you can use this code pattern:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Example query function
export async function getQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  
  return data;
}

// Example insert function
export async function addQuestion(name: string, question: string) {
  const { data, error } = await supabase
    .from('questions')
    .insert({ name, question })
    .select();
    
  if (error) {
    console.error('Error adding question:', error);
    return null;
  }
  
  return data[0];
}
```
