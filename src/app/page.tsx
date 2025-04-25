'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filme, Serie } from '../data/mockData';
import { getFilmes, getSeries } from '../services/filmes';
import Loading from '../components/Loading';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Conteudo = (Filme & { tipo: 'filme' }) | (Serie & { tipo: 'serie' });

const ITENS_POR_PAGINA = 40;

export default function Home() {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'filmes' | 'series'>('todos');
  const [animateIn, setAnimateIn] = useState(false);

  // Efeito para animar os elementos ao carregar a página
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Buscar dados quando a busca, página ou filtro mudar
  const carregarConteudo = useCallback(async (
    pagina: number, 
    tipo: 'todos' | 'filmes' | 'series',
    termoBusca: string
  ) => {
    setCarregando(true);
    setErro(null);
    try {
      let filmesData: Filme[] = [];
      let seriesData: Serie[] = [];
      let totalFilmes = 0;
      let totalSeries = 0;
      let paginasFilmes = 0;
      let paginasSeries = 0;

      // Buscar filmes se estiver na aba 'todos' ou 'filmes'
      if (tipo === 'todos' || tipo === 'filmes') {
        const resFilmes = await getFilmes(pagina, ITENS_POR_PAGINA, termoBusca);
        filmesData = resFilmes.data;
        totalFilmes = resFilmes.totalItens;
        paginasFilmes = resFilmes.totalPaginas;
      }
      
      // Buscar séries se estiver na aba 'todos' ou 'series'
      if (tipo === 'todos' || tipo === 'series') {
        const resSeries = await getSeries(pagina, ITENS_POR_PAGINA, termoBusca);
        seriesData = resSeries.data;
        totalSeries = resSeries.totalItens;
        paginasSeries = resSeries.totalPaginas;
      }

      // Combinar os resultados
      const novosConteudos: Conteudo[] = [
        ...filmesData.map(f => ({ ...f, tipo: 'filme' as const })),
        ...seriesData.map(s => ({ ...s, tipo: 'serie' as const }))
      ];
      
      setConteudos(novosConteudos);
      
      // Definir total de páginas baseado no filtro atual
      if (tipo === 'filmes') {
        setTotalPaginas(paginasFilmes);
      } else if (tipo === 'series') {
        setTotalPaginas(paginasSeries);
      } else { // 'todos'
        setTotalPaginas(Math.max(paginasFilmes, paginasSeries));
      }
      
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
      setErro('Não foi possível carregar o conteúdo.');
      setConteudos([]); // Limpa em caso de erro
      setTotalPaginas(1);
    } finally {
      setCarregando(false);
      window.scrollTo(0, 0); // Rola para o topo ao mudar de página
    }
  }, []);

  // Efeito para carregar conteúdo quando a página, filtro ou busca mudar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarConteudo(paginaAtual, filtroTipo, busca);
    }, 500); // Adiciona um delay para evitar muitas requisições durante a digitação
    
    return () => clearTimeout(timeoutId);
  }, [paginaAtual, filtroTipo, busca, carregarConteudo]);

  // Resetar para página 1 quando o filtro ou busca mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroTipo, busca]);

  // Função para mudar a página
  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900">
      {/* Formas decorativas com animação */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[-20%] w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Cabeçalho */}
        <div className="bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-purple-400">Biblioteca de Conteúdos</h1>
          </div>
        </div>

        {/* Campo de busca e filtros */}
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Campo de busca */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full py-3 pl-12 pr-4 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-purple-300/70"
              />
            </div>
          </div>

          {/* Botões de filtro */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filtroTipo === 'todos' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
                  : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroTipo('filmes')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filtroTipo === 'filmes' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
                  : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10'
              }`}
            >
              Filmes
            </button>
            <button
              onClick={() => setFiltroTipo('series')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filtroTipo === 'series' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
                  : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10'
              }`}
            >
              Séries
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="px-4 mt-4">
          {/* Indicador de Carregamento Principal */}
          {carregando && (
            <div className="flex justify-center py-16">
              <Loading size="large" text="Buscando conteúdo..." variant="film" />
            </div>
          )}

          {/* Mensagem de Erro Principal */}
          {!carregando && erro && (
            <div className="text-center py-10">
              <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-6 mb-4 inline-flex items-center max-w-lg mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-300">{erro}</span>
              </div>
              <button 
                onClick={() => carregarConteudo(paginaAtual, filtroTipo, busca)} 
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-500 hover:to-purple-400 transition-colors shadow-lg shadow-purple-500/20"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Lista de Conteúdo */} 
          {!carregando && !erro && (
            <div>
              {conteudos.length > 0 ? (
                <div className={`transition-all duration-700 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} space-y-3 mb-6`}>
                  {conteudos.map((item, index) => (
                    <Link 
                      key={`${item.tipo}-${item.id}`}
                      href={item.tipo === 'filme' ? `/conteudo/${item.id}` : `/serie/${item.id}`}
                      className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/5 p-3 rounded-xl shadow-lg hover:bg-white/10 transition-all duration-300 group animate-fade-in`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Capa */}
                      <div className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-purple-500/30 transition-all duration-300">
                        <Image
                          src={item.tipo === 'filme' ? item.cover_url || 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=Sem+Capa' : item.capa || 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=Sem+Capa'}
                          alt={`Capa de ${item.tipo === 'filme' ? item.title ?? '' : item.titulo ?? ''}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="56px"
                        />
                      </div>
                      
                      {/* Informações (Título e Categoria) */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate text-white transition-colors duration-300 group-hover:text-purple-300">
                          {item.tipo === 'filme' ? item.title : item.titulo}
                        </h3>
                        <p className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">
                          {item.tipo === 'filme' ? 'Filme' : 'Série'}
                        </p>
                      </div>

                      {/* Botão Ver */}
                      <div className="ml-auto flex-shrink-0">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
                          Ver
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-purple-200 mt-10 py-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5">
                  {busca ? `Nenhum ${filtroTipo === 'todos' ? 'conteúdo' : filtroTipo === 'filmes' ? 'filme' : 'série'} encontrado para "${busca}".` : 'Nenhum conteúdo disponível.'}
                </div>
              )}

              {/* Controles de Paginação */} 
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 pb-8 mx-4">
                  <button
                    onClick={() => mudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1 || carregando}
                    className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm text-purple-200 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => mudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas || carregando}
                    className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
