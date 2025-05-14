
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure this runs after DOM is fully loaded, reducing potential race conditions
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  createRoot(rootElement).render(<App />);
});
