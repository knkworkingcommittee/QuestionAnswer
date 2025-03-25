
import { supabase } from './client';

// Execute this function when the app initializes
export const setupRealtimeSubscriptions = async () => {
  try {
    // Set up a channel for realtime updates on the questions table
    const channel = supabase.channel('public:questions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'questions' 
      }, (payload) => {
        console.log('Change received!', payload);
      })
      .subscribe();
      
    console.log('Realtime subscription set up for questions table');
    
    return channel; // Return the channel so it can be cleaned up if needed
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return null;
  }
};
