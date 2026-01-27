import { Request, Response } from 'express';
import positionService from '../services/PositionService';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

class PositionController {
  public getPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { wallet } = req.query;

      let positions;
      if (wallet && typeof wallet === 'string') {
        positions = await positionService.getWalletPositions(wallet);
      } else {
        positions = await positionService.getAllPositions();
      }

      const summary = {
        totalPositions: positions.length,
        totalValueUSD: positions.reduce((sum, p) => sum + p.positionValue.totalUSD, 0),
        totalFeesUSD: positions.reduce((sum, p) => sum + p.unclaimedFees.totalUSD, 0),
        inRangePositions: positions.filter((p) => p.inRange).length,
        outOfRangePositions: positions.filter((p) => !p.inRange).length,
      };

      res.json({
        success: true,
        data: {
          wallet: wallet || 'all',
          positions,
          summary,
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error getting positions:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve positions',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public getPositionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tokenId } = req.params;

      const position = await positionService.getPositionDetails(tokenId);

      if (!position) {
        res.status(404).json({
          success: false,
          error: {
            code: 'POSITION_NOT_FOUND',
            message: 'Position not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: position,
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error getting position:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve position',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public getAggregatePositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const positions = await positionService.getAllPositions();

      // Group by pool
      const byPool = new Map<string, any[]>();
      positions.forEach((position) => {
        const poolKey = `${position.pool.token0.symbol}/${position.pool.token1.symbol}`;
        if (!byPool.has(poolKey)) {
          byPool.set(poolKey, []);
        }
        byPool.get(poolKey)!.push(position);
      });

      const poolSummaries = Array.from(byPool.entries()).map(([pair, poolPositions]) => ({
        pair,
        poolAddress: poolPositions[0]?.pool.address || '',
        positionCount: poolPositions.length,
        totalValueUSD: poolPositions.reduce((sum, p) => sum + p.positionValue.totalUSD, 0),
        totalFeesUSD: poolPositions.reduce((sum, p) => sum + p.unclaimedFees.totalUSD, 0),
      }));

      const totalValueUSD = positions.reduce((sum, p) => sum + p.positionValue.totalUSD, 0);
      const totalFeesUSD = positions.reduce((sum, p) => sum + p.unclaimedFees.totalUSD, 0);

      res.json({
        success: true,
        data: {
          totalPositions: positions.length,
          totalValueUSD,
          totalFeesEarnedUSD: totalFeesUSD,
          byPool: poolSummaries,
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error getting aggregate positions:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve aggregate positions',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
}

export default new PositionController();
