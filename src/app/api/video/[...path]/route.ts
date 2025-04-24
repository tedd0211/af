import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const videoPath = params.path.join('/');

  try {
    const response = await fetch(`http://srvdigital.fun/movie/${videoPath}`, {
      method: 'GET',
      headers: {
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
        'Range': request.headers.get('range') || '',
      },
    });

    // Copiar os headers da resposta
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    headers.set('Content-Length', response.headers.get('Content-Length') || '');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', response.headers.get('Content-Range') || '');

    // Stream o vídeo
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: 'Erro ao carregar o vídeo' }, { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error('Erro no proxy de vídeo:', error);
    return NextResponse.json({ error: 'Erro ao carregar o vídeo' }, { status: 500 });
  }
} 