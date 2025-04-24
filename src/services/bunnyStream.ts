const BUNNY_LIBRARY_ID = "413846";
const BUNNY_API_KEY = "5a9d959b-7376-454e-aaae354a596f-88ce-43a5";

/**
 * Busca um vídeo no Bunny Stream pelo ID IMDB
 * @param imdbId ID IMDB do filme
 * @returns GUID do vídeo no Bunny Stream ou null se não encontrado
 */
export async function getBunnyGuidByImdbId(imdbId: string): Promise<string | null> {
  try {
    // Endpoint da API do Bunny Stream para listar vídeos
    const apiUrl = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`;
    
    // Faz a requisição para a API do Bunny
    const response = await fetch(apiUrl, {
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Procura pelo vídeo que tem o ID IMDB no título ou metadados
    const video = data.items.find((item: any) => 
      item.title.includes(imdbId) || 
      (item.metaTags && item.metaTags.includes(imdbId))
    );
    
    if (video) {
      return video.guid;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar vídeo no Bunny Stream:', error);
    return null;
  }
}

/**
 * Constrói a URL de incorporação do Bunny Stream
 * @param guid GUID do vídeo no Bunny Stream
 * @returns URL completa para incorporar o vídeo
 */
export function getBunnyEmbedUrl(guid: string): string {
  return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${guid}`;
} 