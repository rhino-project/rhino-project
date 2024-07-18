import React from 'react';
import { createRoot } from 'react-dom/client';

import modelLoader from '@rhino-project/core/models';

import './styles/styles.scss';

modelLoader.loadModels().then(async () => {
  // Import the Root dynamically so that other modelLoader uses are assured
  // to have access to the already loaded models
  const { default: Root } = await import('./Root.js');

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<Root />);
});
