import { ethers, JsonRpcProvider, Contract } from 'ethers';
import config from '../config';
import logger from '../utils/logger';
import { ChainId } from '../types';
import PositionManagerABI from '../blockchain/abis/PositionManager.json';
import StateViewABI from '../blockchain/abis/StateView.json';
import ERC20ABI from '../blockchain/abis/ERC20.json';
import graphService from './GraphService';

class BlockchainService {
  private providers: Map<ChainId, JsonRpcProvider> = new Map();
  private positionManagerContract?: Contract;
  private stateViewContract?: Contract;

  constructor() {
    this.initializeProviders();
    this.initializeContracts();
  }

  private initializeProviders(): void {
    try {
      if (config.rpc.ethereum) {
        this.providers.set(ChainId.ETHEREUM, new JsonRpcProvider(config.rpc.ethereum));
      }
      if (config.rpc.base) {
        this.providers.set(ChainId.BASE, new JsonRpcProvider(config.rpc.base));
      }
      if (config.rpc.arbitrum) {
        this.providers.set(ChainId.ARBITRUM, new JsonRpcProvider(config.rpc.arbitrum));
      }

      logger.info('✅ Blockchain providers initialized');
    } catch (error) {
      logger.error('Failed to initialize providers:', error);
      throw error;
    }
  }

  private initializeContracts(): void {
    try {
      const provider = this.getProvider(ChainId.ETHEREUM);
      
      this.positionManagerContract = new Contract(
        config.contracts.positionManager,
        PositionManagerABI,
        provider
      );

      this.stateViewContract = new Contract(
        config.contracts.stateView,
        StateViewABI,
        provider
      );

      logger.info('✅ Smart contracts initialized');
    } catch (error) {
      logger.error('Failed to initialize contracts:', error);
      throw error;
    }
  }

  public getProvider(chainId: ChainId): JsonRpcProvider {
    const provider = this.providers.get(chainId);
    if (!provider) {
      throw new Error(`Provider not found for chain ${chainId}`);
    }
    return provider;
  }

  public getPositionManagerContract(chainId: ChainId = ChainId.ETHEREUM): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(
      config.contracts.positionManager,
      PositionManagerABI,
      provider
    );
  }

  public getStateViewContract(chainId: ChainId = ChainId.ETHEREUM): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(
      config.contracts.stateView,
      StateViewABI,
      provider
    );
  }

  public getERC20Contract(tokenAddress: string, chainId: ChainId = ChainId.ETHEREUM): Contract {
    const provider = this.getProvider(chainId);
    return new Contract(tokenAddress, ERC20ABI, provider);
  }

  public async getBlockNumber(chainId: ChainId): Promise<number> {
    try {
      const provider = this.getProvider(chainId);
      return await provider.getBlockNumber();
    } catch (error) {
      logger.error(`Error getting block number for chain ${chainId}:`, error);
      throw error;
    }
  }

  public validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  public async getPositionTokenIds(ownerAddress: string, chainId: ChainId = ChainId.ETHEREUM): Promise<string[]> {
    try {
      // Uniswap V4 PositionManager does not implement ERC721Enumerable
      // We need to use The Graph subgraph to get position token IDs
      const tokenIds = await graphService.getPositionTokenIdsByOwner(ownerAddress, chainId);
      logger.info(`Found ${tokenIds.length} positions for ${ownerAddress}`);
      return tokenIds;
    } catch (error) {
      logger.error(`Error getting position token IDs for ${ownerAddress}:`, error);
      throw error;
    }
  }

  public async getPositionData(tokenId: string, chainId: ChainId = ChainId.ETHEREUM): Promise<any> {
    try {
      const contract = this.getPositionManagerContract(chainId);

      // V4 uses getPoolAndPositionInfo instead of positions
      const [poolAndPositionInfo, liquidity] = await Promise.all([
        contract.getPoolAndPositionInfo(tokenId),
        contract.getPositionLiquidity(tokenId),
      ]);

      const [poolKey, packedInfo] = poolAndPositionInfo;

      // Decode packed position info (tickLower: int24, tickUpper: int24)
      // PositionInfo is packed as: tickLower (24 bits) | tickUpper (24 bits) | hasSubscriber (1 bit)
      const infoAsBigInt = BigInt(packedInfo.toString());

      // Extract tickLower (bits 0-23) and tickUpper (bits 24-47)
      // tickLower and tickUpper are int24, so we need to handle sign extension
      const tickLowerRaw = Number(infoAsBigInt & BigInt(0xFFFFFF));
      const tickUpperRaw = Number((infoAsBigInt >> BigInt(24)) & BigInt(0xFFFFFF));

      // Sign extend int24 values
      const tickLower = tickLowerRaw > 0x7FFFFF ? tickLowerRaw - 0x1000000 : tickLowerRaw;
      const tickUpper = tickUpperRaw > 0x7FFFFF ? tickUpperRaw - 0x1000000 : tickUpperRaw;

      return {
        poolKey: {
          currency0: poolKey.currency0,
          currency1: poolKey.currency1,
          fee: Number(poolKey.fee),
          tickSpacing: Number(poolKey.tickSpacing),
          hooks: poolKey.hooks,
        },
        tickLower,
        tickUpper,
        liquidity: liquidity.toString(),
        // V4 doesn't expose fee growth at position level the same way - these would need StateView
        feeGrowthInside0LastX128: '0',
        feeGrowthInside1LastX128: '0',
        tokensOwed0: '0',
        tokensOwed1: '0',
      };
    } catch (error) {
      logger.error(`Error getting position data for token ${tokenId}:`, error);
      throw error;
    }
  }

  public async getTokenInfo(tokenAddress: string, chainId: ChainId = ChainId.ETHEREUM): Promise<{
    symbol: string;
    decimals: number;
    name: string;
  }> {
    try {
      // Handle native ETH (address 0) in Uniswap V4
      const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';
      if (tokenAddress.toLowerCase() === NATIVE_ADDRESS) {
        return {
          symbol: 'ETH',
          decimals: 18,
          name: 'Ether',
        };
      }

      const contract = this.getERC20Contract(tokenAddress, chainId);
      const [symbol, decimals, name] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
        contract.name(),
      ]);

      return {
        symbol,
        decimals: Number(decimals),
        name,
      };
    } catch (error) {
      logger.error(`Error getting token info for ${tokenAddress}:`, error);
      return {
        symbol: 'UNKNOWN',
        decimals: 18,
        name: 'Unknown Token',
      };
    }
  }

  public async getCurrentTick(poolId: string, chainId: ChainId = ChainId.ETHEREUM): Promise<number> {
    try {
      const stateView = this.getStateViewContract(chainId);
      const poolManager = config.contracts.positionManager; // This should be the pool manager address
      const slot0 = await stateView.getSlot0(poolManager, poolId);
      return Number(slot0.tick);
    } catch (error) {
      logger.error(`Error getting current tick for pool ${poolId}:`, error);
      throw error;
    }
  }

  public async getFeeGrowthInside(
    poolId: string,
    tickLower: number,
    tickUpper: number,
    chainId: ChainId = ChainId.ETHEREUM
  ): Promise<{ feeGrowthInside0X128: bigint; feeGrowthInside1X128: bigint }> {
    try {
      const stateView = this.getStateViewContract(chainId);
      const poolManager = config.contracts.positionManager;
      const feeGrowth = await stateView.getFeeGrowthInside(poolManager, poolId, tickLower, tickUpper);

      return {
        feeGrowthInside0X128: feeGrowth.feeGrowthInside0X128,
        feeGrowthInside1X128: feeGrowth.feeGrowthInside1X128,
      };
    } catch (error) {
      logger.error('Error getting fee growth inside:', error);
      throw error;
    }
  }
}

export default new BlockchainService();
