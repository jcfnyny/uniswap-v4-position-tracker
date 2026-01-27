import { Router } from 'express';
import PositionController from '../controllers/PositionController';

const router = Router();

/**
 * @route   GET /api/positions
 * @desc    Get all positions or positions for a specific wallet
 * @query   wallet - Optional wallet address to filter positions
 * @access  Private (requires API key)
 */
router.get('/', PositionController.getPositions);

/**
 * @route   GET /api/positions/aggregate
 * @desc    Get aggregated position data across all wallets
 * @access  Private (requires API key)
 */
router.get('/aggregate', PositionController.getAggregatePositions);

/**
 * @route   GET /api/positions/:tokenId
 * @desc    Get detailed information for a specific position
 * @access  Private (requires API key)
 */
router.get('/:tokenId', PositionController.getPositionById);

export default router;
