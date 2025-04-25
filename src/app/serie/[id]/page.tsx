'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Serie, Temporada, Episodio } from '../../../data/mockData';
import { getSerieById } from '../../../services/filmes';
import Loading from '../../../components/Loading';

export default function SeriePage() {
  const { id } = useParams();
  const router = useRouter();
  const [serie, setSerie] = useState<any>(null);
  const [episodioSelecionado, setEpisodioSelecionado] = useState<any>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const carregarSerie = async () => {
      try {
        const data = await getSerieById(id as string);
        setSerie(data);
        setAnimateIn(true);
      } catch (error) {
        console.error('Erro ao carregar série:', error);
      }
    };

    carregarSerie();
  }, [id]);

  if (!serie) {
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
          <h1 className="text-xl font-bold text-purple-400 truncate">{serie?.titulo || 'Carregando...'}</h1>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="pt-20 relative z-10">
        <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Cabeçalho com capa e informações básicas */}
          <div className={`transition-all duration-700 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
              {/* Capa da série */}
              <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={serie.capa || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Sem+Capa'}
                  alt={`Capa de ${serie.titulo}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              </div>

              {/* Informações básicas */}
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-purple-300">{serie.titulo}</h2>
                <p className="text-sm text-gray-400">{serie.sinopse}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
                    {serie.ano || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de episódios */}
          {serie.temporadas && serie.temporadas.length > 0 && (
            <div className={`transition-all duration-700 delay-200 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="space-y-4">
                {serie.temporadas.map((temporada: any) => (
                  <div key={temporada.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-purple-300 mb-3">Temporada {temporada.numero}</h3>
                    <div className="grid gap-2">
                      {temporada.episodios.map((episodio: any) => (
                        <button
                          key={episodio.id}
                          onClick={() => setEpisodioSelecionado(episodio)}
                          className={`text-left p-3 rounded-lg transition-colors ${
                            episodioSelecionado?.id === episodio.id
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Episódio {episodio.numero}</span>
                            <span className="text-sm opacity-75">{episodio.duracao || 'N/A'}</span>
                          </div>
                          <p className="text-sm mt-1 line-clamp-1">{episodio.titulo}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player de vídeo */}
          {episodioSelecionado && (
            <div className={`transition-all duration-700 delay-300 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <video
                    src={episodioSelecionado.url_video}
                    controls
                    className="absolute top-0 left-0 w-full h-full"
                    poster={serie.capa}
                    preload="metadata"
                    controlsList="nodownload"
                    playsInline
                  >
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 