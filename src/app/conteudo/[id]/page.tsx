'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Filme } from '../../../data/mockData';
import { getFilmeById } from '../../../services/filmes';
import Loading from '../../../components/Loading';
import Link from 'next/link';

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  }
  return `${remainingMinutes}min`;
}

export default function ConteudoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const carregarFilme = async () => {
      try {
        const data = await getFilmeById(id as string);
        setFilme(data);
        setAnimateIn(true);
      } catch (error) {
        console.error('Erro ao carregar filme:', error);
      }
    };

    carregarFilme();
  }, [id]);

  if (!filme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" variant="film" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900">
      {/* Formas decorativas com animação */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[-20%] w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* Cabeçalho Fixo */}
      <div className="bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="text-purple-300 hover:text-purple-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-purple-400 truncate">{filme?.title || 'Carregando...'}</h1>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="pt-20 relative z-10">
        <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Cabeçalho com capa e informações básicas */}
          <div className={`transition-all duration-700 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
              {/* Capa do filme */}
              <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={filme.cover_url || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Sem+Capa'}
                  alt={`Capa de ${filme.title}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              </div>

              {/* Informações básicas */}
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-purple-300">{filme.title}</h2>
                <p className="text-sm text-gray-400">{filme.overview}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
                    {filme.release_date?.split('-')[0] || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
                    {filme.duration || 'N/A'} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Player de vídeo */}
          <div className={`transition-all duration-700 delay-300 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {filme.url_stream && (
              <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <video
                    src={filme.url_stream}
                    controls
                    className="absolute top-0 left-0 w-full h-full"
                    poster={filme.backdrop_path || filme.cover_url}
                    preload="metadata"
                    controlsList="nodownload"
                    playsInline
                  >
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Download */}
          {filme.url_download && (
            <div className={`transition-all duration-700 delay-500 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a
                href={filme.url_download}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-3 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Filme
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 