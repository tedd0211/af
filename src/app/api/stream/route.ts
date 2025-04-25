import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return new NextResponse('URL não fornecida', { status: 400 });
  }

  console.log('URL inicial recebida:', url);

  try {
    // Seguir redirecionamentos manualmente para logar todas as URLs
    let currentUrl = url;
    let redirectCount = 0;
    const MAX_REDIRECTS = 5;

    while (redirectCount < MAX_REDIRECTS) {
      console.log(`Tentativa ${redirectCount + 1} - Fazendo fetch para:`, currentUrl);
      
      const response = await fetch(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        redirect: 'manual' // Não seguir redirecionamentos automaticamente
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      // Se for um redirecionamento
      if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
        const newUrl = response.headers.get('location');
        if (!newUrl) {
          throw new Error('Redirecionamento sem URL de destino');
        }

        // Se a URL for relativa, convertê-la para absoluta
        const nextUrl = newUrl.startsWith('http') ? newUrl : new URL(newUrl, currentUrl).toString();
        console.log(`Redirecionando para:`, nextUrl);
        
        currentUrl = nextUrl;
        redirectCount++;
        continue;
      }

      // Se não for redirecionamento, retornar a resposta
      if (!response.ok) {
        throw new Error(`Erro ao buscar stream: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'video/mp4';
      console.log('Content-Type final:', contentType);
      
      const responseHeaders = {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };

      console.log('URL final após redirecionamentos:', currentUrl);
      console.log('Retornando resposta com headers:', responseHeaders);
      
      return new NextResponse(response.body, {
        status: 200,
        headers: responseHeaders,
      });
    }

    throw new Error(`Número máximo de redirecionamentos (${MAX_REDIRECTS}) excedido`);
  } catch (error: any) {
    console.error('Erro detalhado no proxy de stream:', {
      message: error?.message || 'Erro desconhecido',
      stack: error?.stack,
      url: url
    });
    return new NextResponse(`Erro ao buscar stream: ${error?.message || 'Erro desconhecido'}`, { status: 500 });
  }
} 