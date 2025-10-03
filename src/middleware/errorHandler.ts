import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      statusCode,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        stack: error.stack,
        statusCode
      }
    });
  } else {
    res.status(statusCode).json({
      success: false,
      error: {
        message: statusCode === 500 ? 'Internal Server Error' : message,
        statusCode
      }
    });
  }
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};