'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();

  const goBack = useCallback(() => {
    try {
      // Tenta voltar no histórico do navegador
      if (window.history.length > 1) {
        window.history.back();
        
        // Adiciona um fallback em caso de falha
        setTimeout(() => {
          // Se depois de 100ms ainda estivermos na mesma página,
          // provavelmente o back() não funcionou, então redirecionamos manualmente
          router.push('/');
        }, 100);
      } else {
        // Sem histórico, vai para a página inicial
        router.push('/');
      }
    } catch (error) {
      // Em caso de qualquer erro, volta para a página inicial
      console.error('Erro ao navegar para trás:', error);
      router.push('/');
    }
  }, [router]);

  return {
    goBack,
    navigateTo: (path: string) => router.push(path),
  };
} 