import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  apiKey: string;
  rpc: {
    ethereum: string;
    base: string;
    arbitrum: string;
  };
  contracts: {
    positionManager: string;
    stateView: string;
  };
  graph: {
    apiKey: string;
    apiUrl: string;
  };
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  logging: {
    level: string;
    file: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cache: {
    ttl: number;
  };
  sync: {
    intervalMinutes: number;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY || '',
  rpc: {
    ethereum: process.env.ETHEREUM_RPC_URL || '',
    base: process.env.BASE_RPC_URL || '',
    arbitrum: process.env.ARBITRUM_RPC_URL || '',
  },
  contracts: {
    positionManager: process.env.POSITION_MANAGER_ADDRESS || '0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e',
    stateView: process.env.STATE_VIEW_ADDRESS || '0x7ffe42c4a5deea5b0fec41c94c136cf115597227',
  },
  graph: {
    apiKey: process.env.GRAPH_API_KEY || '3c36aaf072dcdac31d0dbbc9ca61dd93',
    apiUrl: process.env.GRAPH_API_URL || 'https://gateway.thegraph.com/api',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'uniswap_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  },
  sync: {
    intervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES || '5', 10),
  },
};

export default config;
