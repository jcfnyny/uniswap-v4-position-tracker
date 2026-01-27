import axios from 'axios';
import logger from '../utils/logger';
import { PriceData } from '../types';

class PriceService {
  private cache: Map<string, { price: number; timestamp: number }> = new Map();
  private cacheTTL = 300000; // 5 minutes

  public async getTokenPriceUSD(tokenAddress: string, chainId: number = 1): Promise<number> {
    const cacheKey = `${chainId}-${tokenAddress.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.price;
    }

    try {
      // Try CoinGecko first
      const price = await this.fetchFromCoinGecko(tokenAddress, chainId);
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      return price;
    } catch (error) {
      logger.error(`Error fetching price for ${tokenAddress}:`, error);
      
      // Return cached price if available, even if expired
      if (cached) {
        logger.warn(`Using expired cache for ${tokenAddress}`);
        return cached.price;
      }
      
      return 0;
    }
  }

  private async fetchFromCoinGecko(tokenAddress: string, chainId: number): Promise<number> {
    const platformMap: { [key: number]: string } = {
      1: 'ethereum',
      8453: 'base',
      42161: 'arbitrum-one',
    };

    const platform = platformMap[chainId] || 'ethereum';
    
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/${platform}`,
        {
          params: {
            contract_addresses: tokenAddress,
            vs_currencies: 'usd',
          },
          timeout: 5000,
        }
      );

      const price = response.data[tokenAddress.toLowerCase()]?.usd;
      if (price !== undefined) {
        return price;
      }

      throw new Error('Price not found in response');
    } catch (error) {
      logger.error(`CoinGecko API error for ${tokenAddress}:`, error);
      throw error;
    }
  }

  public async getMultipleTokenPrices(
    tokens: Array<{ address: string; chainId: number }>
  ): Promise<Map<string, number>> {
    const prices = new Map<string, number>();

    await Promise.all(
      tokens.map(async (token) => {
        try {
          const price = await this.getTokenPriceUSD(token.address, token.chainId);
          prices.set(token.address.toLowerCase(), price);
        } catch (error) {
          logger.error(`Failed to get price for ${token.address}:`, error);
          prices.set(token.address.toLowerCase(), 0);
        }
      })
    );

    return prices;
  }

  public clearCache(): void {
    this.cache.clear();
    logger.info('Price cache cleared');
  }
}

export default new PriceService();
