import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

export interface Question {
  id: string;
  question: string;
  timestamp: Date;
}

interface QuestionFormProps {
  onSubmit: (question: Omit<Question, 'id' | 'timestamp'>) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast('Please fill in the question field', {
        description: 'The question field is required.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('questions')
        .insert([{ question }]);
      
      if (error) throw error;
      
      // Call the local onSubmit handler to update the UI
      onSubmit({ question });
      
      // Reset the form
      setQuestion('');
      
      toast('Question submitted', {
        description: 'Your question has been added successfully.',
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      toast('Error submitting question', {
        description: 'There was an error submitting your question. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container w-full max-w-2xl mx-auto px-4 animate-fade-in">
      <Card className="border-0 shadow-lg glass-morphism">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight">Ask a Question</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                Your Question
              </Label>
              <Textarea
                id="question"
                className="textarea-field min-h-32 resize-none"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="submit-button w-full hover:shadow-md transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default QuestionForm;
