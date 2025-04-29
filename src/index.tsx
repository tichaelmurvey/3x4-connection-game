import { StrictMode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client';
import { App } from './App';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    			<CookiesProvider defaultSetOptions={{ path: '/' }} >

    <App />
    			</CookiesProvider>
  </StrictMode>
);
