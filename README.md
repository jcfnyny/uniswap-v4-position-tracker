# Uniswap V4 Position Tracker

A backend server application that tracks Uniswap V4 liquidity positions across multiple wallet addresses, providing comprehensive position details including accrued fees through a RESTful API.

## Features

- ✅ Track multiple wallet addresses
- ✅ Monitor Uniswap V4 positions in real-time
- ✅ Calculate unclaimed fees and position values
- ✅ USD price conversion for all tokens
- ✅ RESTful API with JSON responses
- ✅ PostgreSQL database for data persistence
- ✅ Comprehensive logging
- ✅ API key authentication

## Technology Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Blockchain**: ethers.js v6
- **Database**: PostgreSQL with TypeORM
- **Logging**: Winston

## Uniswap V4 Contracts

The application is configured to work with the following Uniswap V4 contracts:

- **Position Manager**: `0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e`
- **State View**: `0x7ffe42c4a5deea5b0fec41c94c136cf115597227`
- **The Graph API Key**: `3c36aaf072dcdac31d0dbbc9ca61dd93`

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 12.x or higher
- npm or yarn
- Ethereum RPC provider (Alchemy, Infura, or QuickNode)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd uniswap-v4-position-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL database

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE uniswap_tracker;
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE uniswap_tracker TO your_user;
\q
```

### 4. Configure environment variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```env
# Server
PORT=3000
API_KEY=your_secure_api_key

# Blockchain RPC
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uniswap_tracker
DB_USER=your_user
DB_PASSWORD=your_password
```

### 5. Build the project

```bash
npm run build
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

All API endpoints require an API key. Include it in the request header:

```bash
x-api-key: your_api_key_here
```

Or as a query parameter:

```bash
?api_key=your_api_key_here
```

### Endpoints

#### Health Check

```http
GET /health
```

No authentication required.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-08T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

#### Create Wallet

```http
POST /api/wallets
```

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "label": "Main Portfolio",
  "tags": ["defi", "v4"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "label": "Main Portfolio",
    "tags": ["defi", "v4"],
    "createdAt": "2026-01-08T12:00:00.000Z"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

#### Get All Wallets

```http
GET /api/wallets
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "id": "uuid",
        "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
        "label": "Main Portfolio",
        "positionCount": 5,
        "createdAt": "2026-01-08T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

#### Get Wallet by Address

```http
GET /api/wallets/:address
```

---

#### Delete Wallet

```http
DELETE /api/wallets/:address
```

---

#### Sync Wallet Positions

```http
POST /api/wallets/:address/sync
```

Manually trigger a sync of positions for a specific wallet.

---

#### Get Positions

```http
GET /api/positions?wallet=0x...
```

**Query Parameters:**
- `wallet` (optional): Filter positions by wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "positions": [
      {
        "tokenId": "12345",
        "owner": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
        "pool": {
          "address": "0x...",
          "token0": {
            "address": "0x...",
            "symbol": "WETH",
            "decimals": 18
          },
          "token1": {
            "address": "0x...",
            "symbol": "USDC",
            "decimals": 6
          },
          "fee": 3000
        },
        "liquidity": "1500000000000000000",
        "tickLower": -887220,
        "tickUpper": 887220,
        "currentTick": 201234,
        "inRange": true,
        "unclaimedFees": {
          "token0": "0.0523",
          "token1": "125.43",
          "token0USD": 185.50,
          "token1USD": 125.43,
          "totalUSD": 310.93
        },
        "positionValue": {
          "token0Amount": "0.75",
          "token1Amount": "2500.00",
          "totalUSD": 5150.00
        },
        "createdAt": "2024-10-15T14:30:00Z",
        "lastUpdated": "2026-01-08T12:00:00Z"
      }
    ],
    "summary": {
      "totalPositions": 5,
      "totalValueUSD": 125000.50,
      "totalFeesUSD": 1523.45,
      "inRangePositions": 4
    }
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

#### Get Position by Token ID

```http
GET /api/positions/:tokenId
```

---

#### Get Aggregate Positions

```http
GET /api/positions/aggregate
```

Get aggregated data across all positions.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPositions": 15,
    "totalValueUSD": 450000.00,
    "totalFeesEarnedUSD": 5234.67,
    "byPool": [
      {
        "pair": "WETH/USDC",
        "poolAddress": "0x...",
        "positionCount": 8,
        "totalValueUSD": 250000.00,
        "totalFeesUSD": 3120.45
      }
    ]
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Create wallet
curl -X POST http://localhost:3000/api/wallets \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "label": "Test Wallet"
  }'

# Get all wallets
curl http://localhost:3000/api/wallets \
  -H "x-api-key: your_api_key"

# Get positions for a wallet
curl "http://localhost:3000/api/positions?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -H "x-api-key: your_api_key"
```

## Project Structure

```
uniswap-v4-position-tracker/
├── src/
│   ├── blockchain/
│   │   ├── abis/              # Smart contract ABIs
│   │   └── contracts/         # Contract interfaces
│   ├── config/
│   │   ├── index.ts           # Configuration loader
│   │   └── database.ts        # Database configuration
│   ├── controllers/
│   │   ├── WalletController.ts
│   │   └── PositionController.ts
│   ├── models/
│   │   ├── Wallet.ts
│   │   ├── Position.ts
│   │   └── FeeCollectionEvent.ts
│   ├── routes/
│   │   ├── walletRoutes.ts
│   │   └── positionRoutes.ts
│   ├── services/
│   │   ├── BlockchainService.ts
│   │   ├── PositionService.ts
│   │   └── PriceService.ts
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts          # Winston logger
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Server entry point
├── tests/                     # Test files
├── logs/                      # Application logs
├── docs/                      # Documentation
├── .env                       # Environment variables
├── .env.example              # Example environment file
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Watch Mode

```bash
npm run dev
```

The server will automatically restart when you make changes to the source code.

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U your_user -d uniswap_tracker -h localhost
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### RPC Connection Issues

- Verify your RPC URL in `.env`
- Check API key validity
- Ensure rate limits are not exceeded

## Performance Considerations

- Positions are cached for 5 minutes by default
- Token prices are cached for 5 minutes
- Database queries use indexes for optimal performance
- Consider implementing Redis for production caching

## Security

- Always use HTTPS in production
- Keep your API key secure
- Use environment variables for sensitive data
- Implement rate limiting for production
- Regular security audits recommended

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`

## Roadmap

- [ ] Multi-chain support (Base, Arbitrum)
- [ ] WebSocket support for real-time updates
- [ ] Historical analytics and reporting
- [ ] Email notifications for position changes
- [ ] GraphQL API
- [ ] Frontend dashboard

## Acknowledgments

- Uniswap V4 Protocol
- ethers.js
- TypeORM
- The Graph Protocol
