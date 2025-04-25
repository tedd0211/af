import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return new NextResponse('URL não fornecida', { status: 400 });
  }

  console.log('URL recebida no proxy:', url);
  console.log('Headers da requisição:', Object.fromEntries(request.headers));

  try {
    console.log('Iniciando fetch para:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'http://afiliados-mu.vercel.app',
        'Origin': 'http://afiliados-mu.vercel.app'
      }
    });

    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      console.error('Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Erro ao buscar stream: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    console.log('Content-Type:', contentType);
    
    const responseHeaders = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    console.log('Retornando resposta com headers:', responseHeaders);
    
    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Erro detalhado no proxy de stream:', {
      message: error?.message || 'Erro desconhecido',
      stack: error?.stack,
      url: url
    });
    return new NextResponse(`Erro ao buscar stream: ${error?.message || 'Erro desconhecido'}`, { status: 500 });
  }
} 