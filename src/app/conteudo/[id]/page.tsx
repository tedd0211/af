'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Filme } from '../../../data/mockData';
import { getFilmeById } from '../../../services/filmes';
import { getBunnyGuidByImdbId, getBunnyEmbedUrl } from '../../../services/bunnyStream';
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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [bunnyUrl, setBunnyUrl] = useState<string | null>(null);
  const [buscandoBunny, setBuscandoBunny] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    carregarFilme();
  }, [id]);
  
  useEffect(() => {
    if (filme?.imdb_id) {
      carregarVideoBunny(filme.imdb_id);
    }
  }, [filme]);

  async function carregarFilme() {
    try {
      setCarregando(true);
      setErro(null);
      const data = await getFilmeById(id as string);
      setFilme(data);
    } catch (error) {
      console.error('Erro ao carregar filme:', error);
      setErro('Não foi possível carregar o filme. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  async function carregarVideoBunny(imdbId: string) {
    try {
      setBuscandoBunny(true);
      const guid = await getBunnyGuidByImdbId(imdbId);
      
      if (guid) {
        setBunnyUrl(getBunnyEmbedUrl(guid));
      } else {
        console.log('Vídeo não encontrado no Bunny Stream para o IMDB ID:', imdbId);
      }
    } catch (error) {
      console.error('Erro ao carregar vídeo do Bunny:', error);
    } finally {
      setBuscandoBunny(false);
    }
  }

  function baixarVideo() {
    if (!filme?.url_stream) return;
    const videoWindow = window.open('', '_blank');
    if (videoWindow) {
      videoWindow.location.href = filme.url_stream;
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
        <Loading size="large" text="Carregando filme..." variant="film" />
      </div>
    );
  }

  if (erro || !filme) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">
            {erro || 'Conteúdo não encontrado'}
          </h1>
          <p className="text-gray-300 mb-6">
            Não foi possível encontrar o conteúdo solicitado. Por favor, tente novamente ou volte para a página inicial.
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
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white mb-2 line-clamp-2">{filme.title}</h1>
                
                <div className="text-purple-300 text-sm mb-3 flex items-center gap-2">
                  {filme.release_year && <span>{filme.release_year}</span>}
                  {filme.duration && (
                    <>
                      {filme.release_year && <span className="text-purple-400/50">•</span>}
                      <span>{formatDuration(filme.duration)}</span>
                    </>
                  )}
                </div>

                {/* Sinopse com altura limitada */}
                {filme.overview && (
                  <div className="relative">
                    <div className="h-[72px] overflow-hidden">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {filme.overview}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                    <button
                      onClick={() => setModalAberto(true)}
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

          {/* Gêneros */}
          {filme.genres && filme.genres.length > 0 && (
            <div className={`transition-all duration-700 delay-200 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-wrap gap-2">
                {filme.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Player de vídeo */}
          <div className={`transition-all duration-700 delay-300 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {buscandoBunny ? (
              <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-56 flex items-center justify-center">
                <Loading size="medium" variant="film" />
              </div>
            ) : bunnyUrl ? (
              <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={bunnyUrl}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  ></iframe>
                </div>
              </div>
            ) : filme.url_stream && (
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
          {filme.url_stream && (
            <div className={`transition-all duration-700 delay-400 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={baixarVideo}
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center py-4 rounded-xl font-medium hover:from-purple-500 hover:to-purple-400 transition-colors shadow-lg shadow-purple-500/20"
              >
                Baixar Agora
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal da sinopse */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-purple-300 mb-4">Sinopse</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {filme.overview}
            </p>
          </div>
        </div>
      )}
    </main>
  );
} 