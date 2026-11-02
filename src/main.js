import { loadDataset } from './provider.js';
import { initUi, showError } from './ui.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

loadDataset()
  .then(initUi)
  .catch(() => showError('Could not load life expectancy data. Please reload.'));
