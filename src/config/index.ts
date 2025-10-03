import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  url: string;
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

interface CorsConfig {
  origin: string[];
  credentials: boolean;
}

interface ServerConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  rateLimit: RateLimitConfig;
  cors: CorsConfig;
}

const getDatabaseUrl = (): string => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !port || !database || !user || !password) {
    throw new Error('Missing required database environment variables. Please check: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
  }

  return `mysql://${user}:${password}@${host}:${port}/${database}`;
};

const parseAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS;
  if (!origins) {
    return ['http://localhost:3000'];
  }
  return origins.split(',').map(origin => origin.trim());
};

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: getDatabaseUrl()
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    message: 'Too many requests from this IP, please try again later.'
  },
  cors: {
    origin: parseAllowedOrigins(),
    credentials: true
  }
};
