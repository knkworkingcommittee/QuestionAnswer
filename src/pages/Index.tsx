
import React, { useState, useEffect } from 'react';
import QuestionForm, { Question } from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions from Supabase when the component mounts
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Map the Supabase data to our Question interface
        const formattedQuestions = data.map((item) => ({
          id: item.id,
          name: item.name,
          question: item.question,
          timestamp: new Date(item.created_at || Date.now()),
        }));
        
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    // Set up a realtime subscription for new questions
    const subscription = supabase
      .channel('public:questions')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'questions' 
      }, (payload) => {
        const newQuestion = {
          id: payload.new.id,
          name: payload.new.name,
          question: payload.new.question,
          timestamp: new Date(payload.new.created_at || Date.now()),
        };
        setQuestions((prev) => [newQuestion, ...prev]);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSubmitQuestion = (questionData: Omit<Question, 'id' | 'timestamp'>) => {
    // The form component now handles the Supabase submission
    // This is just for updating the local state
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9), // This will be overwritten when the realtime subscription receives the actual DB entry
      name: questionData.name,
      question: questionData.question,
      timestamp: new Date(),
    };
    
    setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-[#8B5CF6] animate-pulse tracking-tight">
            HyperTensia 2025
          </h1>
        </div>
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-medium text-primary mb-2 inline-block px-3 py-1 rounded-full bg-primary/10">Community Questions</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Ask Anything</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Submit your questions and see what others are asking. 
            Your contribution helps build our knowledge base.
          </p>
        </div>
        
        <QuestionForm onSubmit={handleSubmitQuestion} />
        <QuestionList questions={questions} isLoading={loading} />
      </div>
    </div>
  );
};

export default Index;
