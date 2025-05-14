
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Initialize supabase auth
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    // Reload on logout for clean state
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
