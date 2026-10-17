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
    return res.status(500).json({
      error: 'Login service could not start. Check the Vercel function logs.'
    });
  }
}
