import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Código que só deve ser executado no cliente
    if (typeof window !== 'undefined') {
      // Inicialização do cliente aqui
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
