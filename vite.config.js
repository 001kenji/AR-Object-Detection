import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//import istanbul from 'vite-plugin-istanbul';

// export default defineConfig({
//   build: {
//     manifest: true,
//     commonjsOptions: { transformMixedEsModules: true }
//   },
//   base: process.env.mode === "production" ? "/static/" : "/",
//   root: "./",
//   plugins: [
//     tailwindcss(),
//     react(),    
//   ],
//   server: {
//     host: '192.168.100.52', //"192.168.56.1", // Use your Wi‑Fi IP or use "0.0.0.0" (or true) to listen on all interfaces
//     // Optional: define the port if needed
//     port: 5173,
//     cors: {
//       origin: [process.env.VITE_APP_API_URL],
//       credentials: true
//     }
//   }
// })

export default defineConfig({
  build: {
    manifest: true,
    commonjsOptions: { transformMixedEsModules: true }, // Change
    assetsDir: '.', // Keeps assets in root of static
  },
  base: process.env.mode === "production" ? "/static/" : "/",
  // base: '/static/', // Ensures paths start with /static/
  root: "./",
  plugins: [
    tailwindcss(),
    react(),    
    ],
    server : {
      host: '0.0.0.0', //"192.168.56.1", // Use your Wi‑Fi IP or use "0.0.0.0" (or true) to listen on all interfaces
      cors : {
        origin : [process.env.VITE_APP_API_URL],
        credentials : true
      }
    }
})
