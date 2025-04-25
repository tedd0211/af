import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return new NextResponse('Path não fornecido', { status: 400 });
  }

  try {
    const response = await fetch(`http://srvdigital.fun/${path}`, {
      headers: {
        'Referer': 'http://afiliados-mu.vercel.app',
        'Origin': 'http://afiliados-mu.vercel.app'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar recurso: ${response.status}`);
    }

    // Obter o tipo de conteúdo
    const contentType = response.headers.get('content-type') || 'video/mp4';
    
    // Criar uma nova resposta com os dados
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erro no proxy:', error);
    return new NextResponse('Erro ao buscar recurso', { status: 500 });
  }
}