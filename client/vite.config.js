import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // root: 'src', // Hanya jika kamu mengubah root direktori proyek
  // build: {
  //   outDir: 'dist', // Tentukan output folder jika dibutuhkan
  // },
});
