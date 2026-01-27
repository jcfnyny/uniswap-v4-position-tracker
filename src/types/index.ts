export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
}

export interface PoolInfo {
  address: string;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: number;
  hookAddress?: string;
  sqrtPriceX96?: string;
  liquidity?: string;
  tick?: number;
}

export interface PositionDetails {
  tokenId: string;
  owner: string;
  pool: PoolInfo;
  liquidity: string;
  tickLower: number;
  tickUpper: number;
  currentTick: number;
  inRange: boolean;
  unclaimedFees: {
    token0: string;
    token1: string;
    token0USD: number;
    token1USD: number;
    totalUSD: number;
  };
  positionValue: {
    token0Amount: string;
    token1Amount: string;
    token0USD: number;
    token1USD: number;
    totalUSD: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}

export interface WalletCreateRequest {
  address: string;
  label?: string;
  tags?: string[];
}

export interface PositionSummary {
  totalPositions: number;
  totalValueUSD: number;
  totalFeesUSD: number;
  inRangePositions: number;
  outOfRangePositions: number;
}

export interface WalletSummary {
  address: string;
  label?: string;
  positionCount: number;
  totalValueUSD: number;
  totalFeesUSD: number;
}

export enum ChainId {
  ETHEREUM = 1,
  BASE = 8453,
  ARBITRUM = 42161,
}

export interface PriceData {
  address: string;
  symbol: string;
  priceUSD: number;
  timestamp: number;
}

export interface FeeGrowth {
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
}
