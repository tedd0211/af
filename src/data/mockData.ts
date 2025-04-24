export interface Filme {
  id: number;
  tmdb_id: string;
  title: string;
  original_title?: string;
  cover_url?: string;
  backdrop_path?: string;
  genres?: string[];
  vote_average?: number;
  vote_count?: number;
  release_year?: string;
  overview?: string;
  imdb_id?: string;
  duration?: number;
  director?: string;
  url_stream?: string;
}

export interface Serie {
  id: number;
  tmdb_id: string;
  titulo: string;
  titulo_original?: string;
  capa?: string;
  fundo?: string;
  generos?: string[];
  nota_media?: number;
  total_votos?: number;
  ano?: string;
  sinopse?: string;
  imdb_id?: string;
  temporadas?: Temporada[];
}

export interface Temporada {
  id: number;
  serie_id: number;
  numero: number;
  nome?: string;
  sinopse?: string;
  capa?: string;
  episodios?: Episodio[];
}

export interface Episodio {
  id: number;
  temporada_id: number;
  numero: number;
  nome?: string;
  sinopse?: string;
  imagem?: string;
  data_exibicao?: string;
  url_video?: string;
  bunny_guid?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItens: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface Conteudo {
  id: string;
  titulo: string;
  tipo: 'filme' | 'serie';
  urlVideo: string;
  urlDownload: string;
  urlCapa: string;
}

export const conteudos: Conteudo[] = [
  {
    id: '1',
    titulo: 'O Poderoso Chefão',
    tipo: 'filme',
    urlVideo: '/videos/chefao.mp4',
    urlDownload: '/downloads/chefao.mp4',
    urlCapa: 'https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg'
  },
  {
    id: '2',
    titulo: 'Breaking Bad',
    tipo: 'serie',
    urlVideo: '/videos/breaking-bad.mp4',
    urlDownload: '/downloads/breaking-bad.mp4',
    urlCapa: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg'
  },
  {
    id: '3',
    titulo: 'Interestelar',
    tipo: 'filme',
    urlVideo: '/videos/interestelar.mp4',
    urlDownload: '/downloads/interestelar.mp4',
    urlCapa: 'https://image.tmdb.org/t/p/w500/qcQFuoNe0vLOK96VUYp1pGPnLfr.jpg'
  },
  {
    id: '4',
    titulo: 'Stranger Things',
    tipo: 'serie',
    urlVideo: '/videos/stranger-things.mp4',
    urlDownload: '/downloads/stranger-things.mp4',
    urlCapa: 'https://image.tmdb.org/t/p/w500/49YwKxVt0WqQvXUJw6QJQz4QZ6h.jpg'
  }
];

export const mockFilmes: Filme[] = [
  // ... dados mock existentes ...
]; 