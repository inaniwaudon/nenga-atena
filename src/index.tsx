import React from 'react';
import { createRoot } from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import App from './components/App';

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
}
`;

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
);
