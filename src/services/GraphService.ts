import axios from 'axios';
import config from '../config';
import logger from '../utils/logger';
import { ChainId } from '../types';

interface PositionFromGraph {
  id: string;
  tokenId: string;
  owner: string;
  origin: string;
  createdAtTimestamp: string;
}

interface GraphResponse {
  data: {
    positions: PositionFromGraph[];
  };
}

class GraphService {
  private subgraphIds: Map<ChainId, string> = new Map();

  constructor() {
    // Uniswap V4 subgraph IDs from The Graph decentralized network
    // These subgraphs include position tracking (not just pools)
    this.subgraphIds.set(ChainId.ETHEREUM, 'DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G');
    this.subgraphIds.set(ChainId.BASE, '2L6yxqUZ7dT6GWoTy9qxNBkf9kEk65me3XPMvbGsmJUZ');
  }

  private getSubgraphUrl(chainId: ChainId): string {
    const subgraphId = this.subgraphIds.get(chainId);
    if (!subgraphId) {
      throw new Error(`No subgraph configured for chain ${chainId}`);
    }
    return `${config.graph.apiUrl}/${config.graph.apiKey}/subgraphs/id/${subgraphId}`;
  }

  public async getPositionTokenIdsByOwner(ownerAddress: string, chainId: ChainId = ChainId.ETHEREUM): Promise<string[]> {
    try {
      const url = this.getSubgraphUrl(chainId);
      const query = `
        {
          positions(where: {owner: "${ownerAddress.toLowerCase()}"}, first: 1000) {
            tokenId
          }
        }
      `;

      const response = await axios.post<GraphResponse>(url, { query });

      if (response.data.data?.positions) {
        const tokenIds = response.data.data.positions.map(p => p.tokenId);
        logger.info(`Found ${tokenIds.length} positions for ${ownerAddress} via subgraph`);
        return tokenIds;
      }

      return [];
    } catch (error) {
      logger.error(`Error querying subgraph for positions: ${error}`);
      throw error;
    }
  }

  public async getPositionDetails(ownerAddress: string, chainId: ChainId = ChainId.ETHEREUM): Promise<PositionFromGraph[]> {
    try {
      const url = this.getSubgraphUrl(chainId);
      const query = `
        {
          positions(where: {owner: "${ownerAddress.toLowerCase()}"}, first: 1000) {
            id
            tokenId
            owner
            origin
            createdAtTimestamp
          }
        }
      `;

      const response = await axios.post<GraphResponse>(url, { query });

      if (response.data.data?.positions) {
        return response.data.data.positions;
      }

      return [];
    } catch (error) {
      logger.error(`Error querying subgraph for position details: ${error}`);
      throw error;
    }
  }
}

export default new GraphService();
