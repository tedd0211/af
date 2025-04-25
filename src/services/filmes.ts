import { supabase } from '../lib/supabase';
import { Filme, Serie, PaginatedResponse } from '../data/mockData';

const ITENS_POR_PAGINA_PADRAO = 40; // Definir 40 itens por página

export async function getFilmes(pagina: number, itensPorPagina: number = ITENS_POR_PAGINA_PADRAO, termoBusca: string = ''): Promise<PaginatedResponse<Filme>> {
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina - 1;

  try {
    // Iniciar a consulta
    let query = supabase
      .from('movies')
      .select('*', { count: 'exact' });
    
    // Aplicar filtro de busca se fornecido
    if (termoBusca) {
      query = query.ilike('title', `%${termoBusca}%`);
    }
    
    // Finalizar a consulta com ordenação e paginação
    const { data, error, count } = await query
      .order('title', { ascending: true })
      .range(inicio, fim);

    if (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }

    const totalItens = count ?? 0;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    const filmesFiltrados = (data as Filme[]) || [];
    const filmesAjustados = filmesFiltrados.map(filme => ({
      ...filme,
      url_stream: adjustVideoUrl(filme.url_stream)
    }));

    return {
      data: filmesAjustados,
      totalItens: totalItens,
      paginaAtual: pagina,
      itensPorPagina: itensPorPagina,
      totalPaginas: totalPaginas,
    };
  } catch (error) {
    console.error('Erro inesperado ao buscar filmes:', error);
    throw error;
  }
}

function adjustVideoUrl(url: string | undefined): string {
  if (!url) return '';
  
  // Se a URL já começa com http, converte para o proxy
  if (url.startsWith('http')) {
    return `/api/stream?url=${encodeURIComponent(url)}`;
  }
  
  // Se não começa com http, adiciona o domínio e converte para o proxy
  const fullUrl = `http://srvdigital.fun/movie${url.startsWith('/') ? url : '/' + url}`;
  return `/api/stream?url=${encodeURIComponent(fullUrl)}`;
}

export async function getFilmeById(id: string): Promise<Filme | null> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Código para "No rows found"
        console.log('Filme não encontrado com o ID:', id);
        return null;
      }
      console.error('Erro ao buscar filme por ID:', error);
      throw error;
    }
    
    if (data) {
      data.url_stream = adjustVideoUrl(data.url_stream);
    }
    
    return data as Filme;
  } catch (error) {
    console.error('Erro inesperado ao buscar filme por ID:', error);
    throw error;
  }
}

export async function getSeries(pagina: number, itensPorPagina: number = ITENS_POR_PAGINA_PADRAO, termoBusca: string = ''): Promise<PaginatedResponse<Serie>> {
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina - 1;

  try {
    // Iniciar a consulta
    let query = supabase
      .from('series')
      .select('*', { count: 'exact' });
    
    // Aplicar filtro de busca se fornecido
    if (termoBusca) {
      query = query.ilike('titulo', `%${termoBusca}%`);
    }
    
    // Finalizar a consulta com ordenação e paginação
    const { data, error, count } = await query
      .order('titulo', { ascending: true })
      .range(inicio, fim);

    if (error) {
      console.error('Erro ao buscar séries:', error);
      throw error;
    }

    const totalItens = count ?? 0;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    const seriesFiltradas = (data as Serie[]) || [];
    const seriesAjustadas = seriesFiltradas.map(serie => ({
      ...serie,
      url_stream: adjustVideoUrl(serie.url_stream)
    }));

    return {
      data: seriesAjustadas,
      totalItens: totalItens,
      paginaAtual: pagina,
      itensPorPagina: itensPorPagina,
      totalPaginas: totalPaginas,
    };
  } catch (error) {
    console.error('Erro inesperado ao buscar séries:', error);
    throw error;
  }
}

export async function getSerieById(id: string): Promise<Serie | null> {
  try {
    const { data: serieData, error: serieError } = await supabase
      .from('series')
      .select(`
        *,
        temporadas: temporadas ( *,
          episodios: episodios ( * )
        )
      `)
      .eq('id', id)
      .single();

    if (serieError) {
      if (serieError.code === 'PGRST116') {
        console.log('Série não encontrada com o ID:', id);
        return null;
      }
      console.error('Erro ao buscar série por ID:', serieError);
      throw serieError;
    }

    // Ordenar temporadas e episódios por número
    if (serieData.temporadas) {
      serieData.temporadas.sort((a: any, b: any) => a.numero - b.numero);
      serieData.temporadas.forEach((temporada: any) => {
        if (temporada.episodios) {
          temporada.episodios.sort((a: any, b: any) => a.numero - b.numero);
          // Converter URLs dos episódios
          temporada.episodios.forEach((episodio: any) => {
            episodio.url_video = adjustVideoUrl(episodio.url_video);
          });
        }
      });
    }

    const serieAjustada = {
      ...serieData,
      url_stream: adjustVideoUrl(serieData.url_stream)
    };

    return serieAjustada as Serie;
  } catch (error) {
    console.error('Erro inesperado ao buscar série por ID:', error);
    throw error;
  }
} 