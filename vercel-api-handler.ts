import type { Request, Response } from 'express';

export default async function forwardToExpress(
  req: Request,
  res: Response,
  routePath = '/api'
) {
  try {
    const { default: app } = await import('./server.ts');
    const requestUrl = new URL(req.url || '/', 'http://localhost');

    if (routePath !== '/api') {
      requestUrl.pathname = routePath;
    } else if (!requestUrl.pathname.startsWith('/api/')) {
      requestUrl.pathname = `/api${requestUrl.pathname === '/' ? '' : requestUrl.pathname}`;
    }

    req.url = `${requestUrl.pathname}${requestUrl.search}`;
    return app(req, res);
  } catch (error) {
    console.error('Failed to initialize the Vercel API function:', error);
    const details = (error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown initialization error')
      .replace(/\bpostgres(?:ql)?:\/\/[^\s"'<>]+/gi, 'postgresql://[redacted]')
      .replace(/\b(password|secret|token|api[_-]?key|authorization)(\s*[=:]\s*)[^\s,;]+/gi, '$1$2[redacted]')
      .slice(0, 240);
    return res.status(500).json({
      error: `API service could not start (${details}). Check the Vercel function logs.`
    });
  }
}
