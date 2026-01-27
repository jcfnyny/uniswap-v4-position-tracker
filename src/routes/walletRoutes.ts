import { Router } from 'express';
import WalletController from '../controllers/WalletController';

const router = Router();

/**
 * @route   POST /api/wallets
 * @desc    Create a new wallet to track
 * @access  Private (requires API key)
 */
router.post('/', WalletController.createWallet);

/**
 * @route   GET /api/wallets
 * @desc    Get all tracked wallets
 * @access  Private (requires API key)
 */
router.get('/', WalletController.getWallets);

/**
 * @route   GET /api/wallets/:address
 * @desc    Get wallet by address
 * @access  Private (requires API key)
 */
router.get('/:address', WalletController.getWalletByAddress);

/**
 * @route   DELETE /api/wallets/:address
 * @desc    Delete a wallet
 * @access  Private (requires API key)
 */
router.delete('/:address', WalletController.deleteWallet);

/**
 * @route   POST /api/wallets/:address/sync
 * @desc    Manually sync positions for a wallet
 * @access  Private (requires API key)
 */
router.post('/:address/sync', WalletController.syncWalletPositions);

export default router;
