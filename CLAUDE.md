# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server with hot reload (nodemon + ts-node)
npm run build        # Compile TypeScript to dist/
npm start            # Run production build
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm test             # Run Jest tests
npm test -- --watch  # Watch mode
npm test -- path/to/test.ts  # Run single test file
```

## Architecture Overview

This is a Node.js/TypeScript backend that tracks Uniswap V4 liquidity positions across multiple wallets. It uses Express.js, PostgreSQL with TypeORM, and ethers.js v6.

### Layered Architecture

```
Routes → Controllers → Services → (Blockchain/Graph/Database)
```

- **Controllers** (`src/controllers/`) - HTTP request/response handling
- **Services** (`src/services/`) - Business logic, exported as singletons
- **Models** (`src/models/`) - TypeORM entities (Wallet, Position, FeeCollectionEvent)

### Key Services

- **BlockchainService** - RPC provider management, smart contract interactions via ethers.js
- **PositionService** - Orchestrates position syncing, data transformation, database operations
- **GraphService** - Queries Uniswap V4 subgraphs (required because V4 PositionManager lacks ERC721Enumerable)
- **PriceService** - Token prices via CoinGecko with in-memory caching

### Data Flow for Position Sync

1. GraphService queries subgraph for wallet's position token IDs
2. BlockchainService calls PositionManager contract for each position's data
3. BlockchainService fetches ERC20 token metadata (symbol, decimals)
4. PositionService computes pool ID and saves to PostgreSQL

### Multi-Chain Support

Configured for Ethereum (1), Base (8453), and Arbitrum (42161). Each chain has:
- Separate RPC URL in config
- Corresponding subgraph ID in GraphService

### Contract ABIs

Located in `src/blockchain/abis/`:
- **PositionManager** - Main V4 NFT contract for positions
- **StateView** - Read-only contract for pool state (current tick, fee growth)
- **ERC20** - Standard token interface

### Database

PostgreSQL with TypeORM. Schema auto-syncs in development mode. Key relationships:
- Wallet (1) → (many) Position
- Position has indexes on `owner` and `poolAddress`

### Authentication

API key via `x-api-key` header or `api_key` query param. Health endpoint (`/health`) is public.

## Configuration

All config loaded from environment variables in `src/config/index.ts`. Copy `.env.example` to `.env` and configure:
- RPC URLs (Alchemy/Infura)
- PostgreSQL connection
- The Graph API key
- API key for authentication
