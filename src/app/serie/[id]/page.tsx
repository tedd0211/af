'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Serie, Temporada, Episodio } from '../../../data/mockData';
import { getSerieById } from '../../../services/filmes';
import { getBunnyEmbedUrl } from '../../../services/bunnyStream';
import Loading from '../../../components/Loading';
import Header from '../../../components/Header';

export default function SeriePage() {
  const { id } = useParams();
  const [serie, setSerie] = useState<Serie | null>(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState<number | null>(null);
  const [episodioSelecionado, setEpisodioSelecionado] = useState<Episodio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoEpisodio, setCarregandoEpisodio] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalDescricaoAberto, setModalDescricaoAberto] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    carregarSerie();
  }, [id]);

  // Quando a série carrega, selecionamos a primeira temporada por padrão
  useEffect(() => {
    if (serie?.temporadas && serie.temporadas.length > 0) {
      setTemporadaSelecionada(serie.temporadas[0].numero);
    }
  }, [serie]);

  async function carregarSerie() {
    try {
      setCarregando(true);
      setErro(null);
      const data = await getSerieById(id as string);
      setSerie(data);
    } catch (error) {
      console.error('Erro ao carregar série:', error);
      setErro('Não foi possível carregar a série. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  // Função para selecionar um episódio para reprodução
  function selecionarEpisodio(episodio: Episodio) {
    setEpisodioSelecionado(episodio);
    setCarregandoEpisodio(true);
    // Simular carregamento
    setTimeout(() => {
      setCarregandoEpisodio(false);
    }, 500);
  }

  // Obter a temporada atual selecionada
  const temporadaAtual = serie?.temporadas?.find(t => t.numero === temporadaSelecionada) || null;

  // Obter URL do player Bunny para o episódio selecionado
  const videoUrl = episodioSelecionado?.url_video || null;
  const bunnyUrl = episodioSelecionado?.bunny_guid ? getBunnyEmbedUrl(episodioSelecionado.bunny_guid) : null;

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
        <Loading size="large" text="Carregando série..." variant="film" />
      </div>
    );
  }

  if (erro || !serie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">
            {erro || 'Série não encontrada'}
          </h1>
          <p className="text-gray-300 mb-6">
            Não foi possível encontrar a série solicitada. Por favor, tente novamente ou volte para a página inicial.
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-500 hover:to-purple-400 transition-colors shadow-lg shadow-purple-500/20"
          >
            Voltar para a página inicial
          </Link>
        </div>
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
      
      <Header showBackButton={true} />
      
      {/* Conteúdo principal */}
      <div className="pt-16 relative z-10">
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
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white mb-2 line-clamp-2">{serie.titulo}</h1>
                
                <div className="text-purple-300 text-sm mb-3 flex items-center gap-2">
                  {serie.ano && <span>{serie.ano}</span>}
                </div>

                {/* Gêneros */}
                {serie.generos && serie.generos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {serie.generos.map((genero, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 rounded-full text-xs"
                      >
                        {genero}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sinopse com altura limitada */}
                {serie.sinopse && (
                  <div className="relative">
                    <div className="h-[72px] overflow-hidden">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {serie.sinopse}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                    <button
                      onClick={() => setModalDescricaoAberto(true)}
                      className="text-purple-400 text-sm hover:text-purple-300 transition-colors mt-1 flex items-center"
                    >
                      Ler mais
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selector de Temporadas e Episódios */}
          {serie.temporadas && serie.temporadas.length > 0 && (
            <div className={`space-y-4 transition-all duration-700 delay-200 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Seletor de Temporadas */}
              <div className="flex overflow-x-auto gap-2 py-2 scrollbar-hide no-scrollbar">
                {serie.temporadas.map((temporada) => (
                  <button
                    key={temporada.id}
                    onClick={() => setTemporadaSelecionada(temporada.numero)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                      temporadaSelecionada === temporada.numero
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    Temporada {temporada.numero}
                  </button>
                ))}
              </div>

              {/* Lista Horizontal de Episódios */}
              {temporadaAtual?.episodios && (
                <div className="space-y-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
                  <h2 className="text-base font-semibold text-purple-300 mb-3">
                    Episódios - {temporadaAtual.nome || `Temporada ${temporadaAtual.numero}`}
                  </h2>
                  <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
                    {temporadaAtual.episodios.map((episodio) => (
                      <button
                        key={episodio.id}
                        onClick={() => selecionarEpisodio(episodio)}
                        className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                          episodioSelecionado?.id === episodio.id
                            ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 backdrop-blur-sm border-white/20 text-gray-400 hover:bg-white/10 hover:border-white/30'
                        }`}
                        title={episodio.nome || `Episódio ${episodio.numero}`}
                      >
                        <span className="text-lg font-bold">
                          {episodio.numero}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Player de vídeo */}
          {episodioSelecionado && (
            <div className={`transition-all duration-700 delay-300 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                {carregandoEpisodio ? (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loading size="medium" variant="film" />
                    </div>
                  </div>
                ) : bunnyUrl ? (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      src={bunnyUrl}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    ></iframe>
                  </div>
                ) : videoUrl ? (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <video
                      src={videoUrl}
                      controls
                      className="absolute top-0 left-0 w-full h-full"
                      poster={episodioSelecionado.imagem || serie.fundo}
                      preload="metadata"
                      controlsList="nodownload"
                      playsInline
                    >
                      Seu navegador não suporta a reprodução de vídeos.
                    </video>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-purple-300/70">Não há vídeo disponível para este episódio.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de sinopse completa */}
      {modalDescricaoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setModalDescricaoAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-purple-300 mb-4">Sinopse</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {serie.sinopse}
            </p>
          </div>
        </div>
      )}
    </main>
  );
} 