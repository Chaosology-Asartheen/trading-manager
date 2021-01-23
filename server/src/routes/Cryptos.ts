import binance from '@shared/binance';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/prices', async (req: Request, res: Response) => {
  const prices = await binance.prices();

  res.json(prices);
});

export default router;