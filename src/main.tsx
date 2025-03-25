
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupRealtimeSubscriptions } from './integrations/supabase/realtime';

// Set up realtime subscriptions
setupRealtimeSubscriptions().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
