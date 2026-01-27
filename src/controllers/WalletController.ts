import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Wallet } from '../models/Wallet';
import blockchainService from '../services/BlockchainService';
import positionService from '../services/PositionService';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { ChainId } from '../types';

class WalletController {
  private walletRepository = AppDataSource.getRepository(Wallet);

  public createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address, label, tags } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ADDRESS',
            message: 'Wallet address is required',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!blockchainService.validateAddress(address)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid Ethereum address format',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const existingWallet = await this.walletRepository.findOne({
        where: { address: address.toLowerCase() },
      });

      if (existingWallet) {
        res.status(409).json({
          success: false,
          error: {
            code: 'WALLET_EXISTS',
            message: 'Wallet already exists',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const wallet = this.walletRepository.create({
        address: address.toLowerCase(),
        label,
        tags,
      });

      await this.walletRepository.save(wallet);

      // Sync positions in background
      positionService.syncWalletPositions(address.toLowerCase(), ChainId.ETHEREUM).catch((error) => {
        logger.error(`Background position sync failed for ${address}:`, error);
      });

      res.status(201).json({
        success: true,
        data: {
          id: wallet.id,
          address: wallet.address,
          label: wallet.label,
          tags: wallet.tags,
          createdAt: wallet.createdAt,
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error creating wallet:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create wallet',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public getWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const wallets = await this.walletRepository.find({
        relations: ['positions'],
      });

      const walletsData = wallets.map((wallet) => ({
        id: wallet.id,
        address: wallet.address,
        label: wallet.label,
        tags: wallet.tags,
        positionCount: wallet.positions?.length || 0,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      }));

      res.json({
        success: true,
        data: { wallets: walletsData },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error getting wallets:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve wallets',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public getWalletByAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;

      const wallet = await this.walletRepository.findOne({
        where: { address: address.toLowerCase() },
        relations: ['positions'],
      });

      if (!wallet) {
        res.status(404).json({
          success: false,
          error: {
            code: 'WALLET_NOT_FOUND',
            message: 'Wallet not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: wallet.id,
          address: wallet.address,
          label: wallet.label,
          tags: wallet.tags,
          positionCount: wallet.positions?.length || 0,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt,
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error getting wallet:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve wallet',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public deleteWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;

      const wallet = await this.walletRepository.findOne({
        where: { address: address.toLowerCase() },
      });

      if (!wallet) {
        res.status(404).json({
          success: false,
          error: {
            code: 'WALLET_NOT_FOUND',
            message: 'Wallet not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.walletRepository.remove(wallet);

      res.json({
        success: true,
        data: {
          message: 'Wallet deleted successfully',
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error deleting wallet:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete wallet',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  public syncWalletPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;

      const wallet = await this.walletRepository.findOne({
        where: { address: address.toLowerCase() },
      });

      if (!wallet) {
        res.status(404).json({
          success: false,
          error: {
            code: 'WALLET_NOT_FOUND',
            message: 'Wallet not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await positionService.syncWalletPositions(address.toLowerCase(), ChainId.ETHEREUM);

      res.json({
        success: true,
        data: {
          message: 'Positions synced successfully',
        },
        timestamp: new Date().toISOString(),
        requestId: uuidv4(),
      });
    } catch (error) {
      logger.error('Error syncing wallet positions:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to sync positions',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
}

export default new WalletController();
