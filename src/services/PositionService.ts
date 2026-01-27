import { AppDataSource } from '../config/database';
import { Position } from '../models/Position';
import { Wallet } from '../models/Wallet';
import blockchainService from './BlockchainService';
import priceService from './PriceService';
import logger from '../utils/logger';
import { ChainId, PositionDetails } from '../types';
import { ethers } from 'ethers';

class PositionService {
  private positionRepository = AppDataSource.getRepository(Position);
  private walletRepository = AppDataSource.getRepository(Wallet);

  public async syncWalletPositions(walletAddress: string, chainId: ChainId = ChainId.ETHEREUM): Promise<void> {
    try {
      logger.info(`Syncing positions for wallet ${walletAddress}`);

      const tokenIds = await blockchainService.getPositionTokenIds(walletAddress, chainId);

      for (const tokenId of tokenIds) {
        await this.syncPosition(tokenId, walletAddress, chainId);
      }

      logger.info(`Synced ${tokenIds.length} positions for ${walletAddress}`);
    } catch (error) {
      logger.error(`Error syncing positions for ${walletAddress}:`, error);
      throw error;
    }
  }

  private async syncPosition(tokenId: string, owner: string, chainId: ChainId): Promise<Position> {
    try {
      const positionData = await blockchainService.getPositionData(tokenId, chainId);

      // Parse pool data from poolId - This is a simplified version
      // In reality, you'd need to decode the poolId to get token addresses
      const poolId = positionData.poolId;
      
      // For now, we'll use placeholder token info
      // You'll need to implement proper pool data fetching
      const token0Address = '0x0000000000000000000000000000000000000000';
      const token1Address = '0x0000000000000000000000000000000000000000';

      const [token0Info, token1Info] = await Promise.all([
        blockchainService.getTokenInfo(token0Address, chainId),
        blockchainService.getTokenInfo(token1Address, chainId),
      ]);

      let position = await this.positionRepository.findOne({
        where: { tokenId },
      });

      if (!position) {
        position = this.positionRepository.create({
          tokenId,
          owner,
          chainId,
        });
      }

      position.poolAddress = poolId;
      position.token0Address = token0Address;
      position.token0Symbol = token0Info.symbol;
      position.token0Decimals = token0Info.decimals;
      position.token1Address = token1Address;
      position.token1Symbol = token1Info.symbol;
      position.token1Decimals = token1Info.decimals;
      position.fee = 3000; // Default, should be parsed from pool
      position.liquidity = positionData.liquidity;
      position.tickLower = Number(positionData.tickLower);
      position.tickUpper = Number(positionData.tickUpper);
      position.feeGrowthInside0LastX128 = positionData.feeGrowthInside0LastX128;
      position.feeGrowthInside1LastX128 = positionData.feeGrowthInside1LastX128;
      position.tokensOwed0 = positionData.tokensOwed0;
      position.tokensOwed1 = positionData.tokensOwed1;
      position.lastSyncedAt = new Date();

      await this.positionRepository.save(position);
      return position;
    } catch (error) {
      logger.error(`Error syncing position ${tokenId}:`, error);
      throw error;
    }
  }

  public async getPositionDetails(tokenId: string): Promise<PositionDetails | null> {
    try {
      const position = await this.positionRepository.findOne({
        where: { tokenId },
      });

      if (!position) {
        return null;
      }

      // Get current tick
      const currentTick = await blockchainService.getCurrentTick(
        position.poolAddress,
        position.chainId || ChainId.ETHEREUM
      );

      // Calculate if position is in range
      const inRange = currentTick >= position.tickLower && currentTick <= position.tickUpper;

      // Get token prices
      const [token0Price, token1Price] = await Promise.all([
        priceService.getTokenPriceUSD(position.token0Address, position.chainId),
        priceService.getTokenPriceUSD(position.token1Address, position.chainId),
      ]);

      // Calculate unclaimed fees
      const token0Fees = ethers.formatUnits(position.tokensOwed0, position.token0Decimals);
      const token1Fees = ethers.formatUnits(position.tokensOwed1, position.token1Decimals);
      const token0FeesUSD = parseFloat(token0Fees) * token0Price;
      const token1FeesUSD = parseFloat(token1Fees) * token1Price;

      // Calculate position value (simplified - actual calculation requires more complex math)
      const liquidityValue = parseFloat(ethers.formatUnits(position.liquidity, 18));

      const positionDetails: PositionDetails = {
        tokenId: position.tokenId,
        owner: position.owner,
        pool: {
          address: position.poolAddress,
          token0: {
            address: position.token0Address,
            symbol: position.token0Symbol,
            decimals: position.token0Decimals,
          },
          token1: {
            address: position.token1Address,
            symbol: position.token1Symbol,
            decimals: position.token1Decimals,
          },
          fee: position.fee,
          hookAddress: position.hookAddress,
        },
        liquidity: position.liquidity,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        currentTick,
        inRange,
        unclaimedFees: {
          token0: token0Fees,
          token1: token1Fees,
          token0USD: token0FeesUSD,
          token1USD: token1FeesUSD,
          totalUSD: token0FeesUSD + token1FeesUSD,
        },
        positionValue: {
          token0Amount: '0', // Requires complex calculation
          token1Amount: '0',
          token0USD: 0,
          token1USD: 0,
          totalUSD: liquidityValue, // Simplified
        },
        createdAt: position.createdAt.toISOString(),
        lastUpdated: position.lastSyncedAt.toISOString(),
      };

      return positionDetails;
    } catch (error) {
      logger.error(`Error getting position details for ${tokenId}:`, error);
      throw error;
    }
  }

  public async getWalletPositions(walletAddress: string): Promise<PositionDetails[]> {
    try {
      const positions = await this.positionRepository.find({
        where: { owner: walletAddress.toLowerCase() },
      });

      const positionDetails = await Promise.all(
        positions.map((pos) => this.getPositionDetails(pos.tokenId))
      );

      return positionDetails.filter((p): p is PositionDetails => p !== null);
    } catch (error) {
      logger.error(`Error getting wallet positions for ${walletAddress}:`, error);
      throw error;
    }
  }

  public async getAllPositions(): Promise<PositionDetails[]> {
    try {
      const positions = await this.positionRepository.find();
      const positionDetails = await Promise.all(
        positions.map((pos) => this.getPositionDetails(pos.tokenId))
      );

      return positionDetails.filter((p): p is PositionDetails => p !== null);
    } catch (error) {
      logger.error('Error getting all positions:', error);
      throw error;
    }
  }
}

export default new PositionService();
