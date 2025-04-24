import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const videoPath = Array.isArray(path) ? path.join('/') : path;

  try {
    const response = await fetch(`http://srvdigital.fun/movie/${videoPath}`, {
      method: 'GET',
      headers: {
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
        'Range': req.headers.range || '',
      },
    });

    // Copiar os headers da resposta
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    res.setHeader('Content-Length', response.headers.get('Content-Length') || '');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range', response.headers.get('Content-Range') || '');

    // Stream o vídeo
    const reader = response.body?.getReader();
    if (!reader) {
      res.status(500).json({ error: 'Erro ao carregar o vídeo' });
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error('Erro no proxy de vídeo:', error);
    res.status(500).json({ error: 'Erro ao carregar o vídeo' });
  }
} 