import { Response } from 'express';

export const errorHandler = (err: Error, res: Response): void => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
};
