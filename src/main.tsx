import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeSecurity } from "./utils/securityEnforcement";

// Initialize security enforcement
initializeSecurity();

createRoot(document.getElementById("root")!).render(<App />);
