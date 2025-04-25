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
  const [serie, setSerie] = useState<Serie | null>(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState<Temporada | null>(null);
  const [episodioSelecionado, setEpisodioSelecionado] = useState<Episodio | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const carregarSerie = async () => {
      try {
        const data = await getSerieById(id as string);
        if (data) {
          setSerie(data);
          const temporadas = data.temporadas;
          if (temporadas && temporadas.length > 0) {
            setTemporadaSelecionada(temporadas[0]);
            const episodios = temporadas[0].episodios;
            if (episodios && episodios.length > 0) {
              setEpisodioSelecionado(episodios[0]);
            }
          }
          setAnimateIn(true);
        }
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

      {/* Modal da Sinopse */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setModalAberto(false)}>
          <div className="bg-gray-900/95 max-w-lg w-full p-6 rounded-2xl border border-purple-500/20 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-purple-300 mb-4">Sinopse</h3>
            <p className="text-gray-300 leading-relaxed">{serie.sinopse}</p>
            <button 
              className="mt-6 text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => setModalAberto(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

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
          <h1 className="text-xl font-bold text-purple-400 truncate">{serie.titulo}</h1>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="pt-8 relative z-10">
        <div className="px-4 py-4 max-w-lg mx-auto space-y-6">
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
              <div className="flex-1 min-h-[12rem] flex flex-col">
                <h2 className="text-xl font-bold text-purple-300">{serie.titulo}</h2>
                <div className="relative flex-1 overflow-hidden">
                  <p className="text-sm text-gray-400 line-clamp-4">{serie.sinopse}</p>
                  {serie.sinopse && serie.sinopse.length > 200 && (
                    <button 
                      onClick={() => setModalAberto(true)}
                      className="absolute bottom-0 right-0 text-xs text-purple-400 hover:text-purple-300 transition-colors bg-gradient-to-l from-gray-900/90 via-gray-900/90 pl-4"
                    >
                      ler mais...
                    </button>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
                    {serie.ano || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
                    {serie.temporadas?.length || 0} Temporadas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seletor de Temporadas */}
          {serie.temporadas && serie.temporadas.length > 0 && (
            <div className={`transition-all duration-700 delay-300 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-2">
                  {serie.temporadas.map((temporada) => (
                    <button
                      key={temporada.id}
                      onClick={() => {
                        setTemporadaSelecionada(temporada);
                        const episodios = temporada.episodios;
                        if (episodios && episodios.length > 0) {
                          setEpisodioSelecionado(episodios[0]);
                        }
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 ${
                        temporadaSelecionada?.id === temporada.id
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      } border border-white/10`}
                    >
                      Temporada {temporada.numero}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Seletor de Episódios */}
          {temporadaSelecionada?.episodios && temporadaSelecionada.episodios.length > 0 && (
            <div className={`transition-all duration-700 delay-400 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-2">
                  {temporadaSelecionada.episodios.map((episodio) => (
                    <button
                      key={episodio.id}
                      onClick={() => setEpisodioSelecionado(episodio)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 ${
                        episodioSelecionado?.id === episodio.id
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      } border border-white/10`}
                    >
                      EP {episodio.numero}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Player de vídeo */}
          {episodioSelecionado && (
            <div className={`transition-all duration-700 delay-500 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-purple-300">
                    {episodioSelecionado.titulo}
                  </h3>
                  <span className="text-sm text-purple-400/70">
                    {episodioSelecionado.duracao}
                  </span>
                </div>
                
                <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <video
                      src={episodioSelecionado.url_video}
                      controls
                      className="absolute top-0 left-0 w-full h-full"
                      poster={episodioSelecionado.imagem || serie.capa}
                      preload="metadata"
                      controlsList="nodownload"
                      playsInline
                    >
                      Seu navegador não suporta a reprodução de vídeos.
                    </video>
                  </div>
                </div>

                {/* Botão de Download */}
                <a
                  href={episodioSelecionado.url_video}
                  download
                  className="w-full flex items-center justify-center gap-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-3 rounded-xl transition-all duration-300 group border border-purple-500/20 hover:border-purple-500/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-medium">Baixar Episódio</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 