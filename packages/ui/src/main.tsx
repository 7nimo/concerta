import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { themeActions } from './core/store/services/theme/slice';
import { store } from './core/store/store';
import App from './App';

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  store.dispatch(themeActions.changeColorScheme('dark'));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
