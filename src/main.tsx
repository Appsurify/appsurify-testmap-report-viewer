import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.tsx'
import ReportProviders from './ReportProviders.tsx';
import '@appsurify-testmap/rrweb-player/dist/style.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ChakraProvider>
        <ReportProviders>
          <App />
        </ReportProviders>
      </ChakraProvider>

  </StrictMode>,
)
