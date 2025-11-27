// src\app\index.tsx

import { StrictMode } from 'react';
import { createRoot } from  'react-dom/client';
import { Provider } from 'react-redux';
import store from './services/store';
import App from './app/App';

import './normalize.css';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
