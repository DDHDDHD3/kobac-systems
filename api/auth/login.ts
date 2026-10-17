import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { default: app } = await import('../../server');
    const requestUrl = new URL(req.url || '/', 'http://localhost');

    if (requestUrl.pathname === '/' || requestUrl.pathname === '/login') {
      requestUrl.pathname = '/api/auth/login';
    } else if (!requestUrl.pathname.startsWith('/api/')) {
      requestUrl.pathname = `/api${requestUrl.pathname}`;
    }

    req.url = `${requestUrl.pathname}${requestUrl.search}`;
    return app(req, res);
  } catch (error) {
    console.error('Failed to initialize the staff login API function:', error);
    const details = (error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown initialization error')
      .replace(/\bpostgres(?:ql)?:\/\/[^\s"'<>]+/gi, 'postgresql://[redacted]')
      .replace(/\b(password|secret|token|api[_-]?key|authorization)(\s*[=:]\s*)[^\s,;]+/gi, '$1$2[redacted]')
      .slice(0, 240);
    return res.status(500).json({
      error: `Login service could not start (${details}). Check the Vercel function logs.`
    });
  }
}
