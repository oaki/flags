import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    cssTarget: 'safari15',
    target: ['es2019', 'safari15'],
  },
  plugins: [react()],
});
