import type { Request, Response } from 'express';
import app from '../server.ts';

export default function handler(req: Request, res: Response) {
  const requestUrl = req.url || '/';
  if (!requestUrl.startsWith('/api')) {
    req.url = `/api${requestUrl.startsWith('/') ? requestUrl : `/${requestUrl}`}`;
  }
  return app(req, res);
}
