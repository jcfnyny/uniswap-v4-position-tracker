# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All API endpoints under `/api/*` require authentication using an API key.

### Include API Key in Request

**Option 1: Header (Recommended)**
```http
x-api-key: your_api_key_here
```

**Option 2: Query Parameter**
```http
?api_key=your_api_key_here
```

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-08T12:00:00.000Z",
  "requestId": "uuid-v4"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

## Endpoints

### Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-08T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## Wallet Endpoints

### Create Wallet

Add a new wallet address to track.

**Endpoint:** `POST /api/wallets`

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "label": "Main Portfolio",
  "tags": ["defi", "v4", "main"]
}
```

**Parameters:**
- `address` (required): Ethereum wallet address (checksummed or lowercase)
- `label` (optional): Human-readable label for the wallet
- `tags` (optional): Array of tags for organization

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "label": "Main Portfolio",
    "tags": ["defi", "v4", "main"],
    "createdAt": "2026-01-08T12:00:00.000Z"
  },
  "timestamp": "2026-01-08T12:00:00.000Z",
  "requestId": "uuid"
}
```

**Error Codes:**
- `MISSING_ADDRESS`: Address not provided
- `INVALID_ADDRESS`: Invalid Ethereum address format
- `WALLET_EXISTS`: Wallet already tracked

---

### Get All Wallets

Retrieve all tracked wallet addresses.

**Endpoint:** `GET /api/wallets`

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
        "label": "Main Portfolio",
        "tags": ["defi", "v4"],
        "positionCount": 5,
        "createdAt": "2026-01-08T12:00:00.000Z",
        "updatedAt": "2026-01-08T12:30:00.000Z"
      }
    ]
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

### Get Wallet by Address

Retrieve a specific wallet by its address.

**Endpoint:** `GET /api/wallets/:address`

**URL Parameters:**
- `address`: Ethereum wallet address

**Example:**
```
GET /api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "label": "Main Portfolio",
    "tags": ["defi", "v4"],
    "positionCount": 5,
    "createdAt": "2026-01-08T12:00:00.000Z",
    "updatedAt": "2026-01-08T12:30:00.000Z"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

**Error Codes:**
- `WALLET_NOT_FOUND`: Wallet address not tracked

---

### Delete Wallet

Remove a wallet from tracking.

**Endpoint:** `DELETE /api/wallets/:address`

**URL Parameters:**
- `address`: Ethereum wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Wallet deleted successfully"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

**Error Codes:**
- `WALLET_NOT_FOUND`: Wallet address not found

---

### Sync Wallet Positions

Manually trigger a sync of positions for a specific wallet.

**Endpoint:** `POST /api/wallets/:address/sync`

**URL Parameters:**
- `address`: Ethereum wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Positions synced successfully"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

**Error Codes:**
- `WALLET_NOT_FOUND`: Wallet not tracked
- `SYNC_FAILED`: Failed to sync positions

---

## Position Endpoints

### Get Positions

Retrieve all positions or filter by wallet address.

**Endpoint:** `GET /api/positions`

**Query Parameters:**
- `wallet` (optional): Filter positions by wallet address

**Examples:**
```
GET /api/positions
GET /api/positions?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

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
          "address": "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
          "token0": {
            "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "symbol": "WETH",
            "decimals": 18
          },
          "token1": {
            "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "symbol": "USDC",
            "decimals": 6
          },
          "fee": 3000,
          "hookAddress": null
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
          "token0USD": 2650.00,
          "token1USD": 2500.00,
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
      "inRangePositions": 4,
      "outOfRangePositions": 1
    }
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

### Get Position by Token ID

Retrieve detailed information for a specific position.

**Endpoint:** `GET /api/positions/:tokenId`

**URL Parameters:**
- `tokenId`: NFT token ID of the position

**Example:**
```
GET /api/positions/12345
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "12345",
    "owner": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "pool": {
      "address": "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
      "token0": {
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "symbol": "WETH",
        "decimals": 18,
        "name": "Wrapped Ether"
      },
      "token1": {
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "symbol": "USDC",
        "decimals": 6,
        "name": "USD Coin"
      },
      "fee": 3000,
      "hookAddress": null
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
      "token0USD": 2650.00,
      "token1USD": 2500.00,
      "totalUSD": 5150.00
    },
    "createdAt": "2024-10-15T14:30:00Z",
    "lastUpdated": "2026-01-08T12:00:00Z"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

**Error Codes:**
- `POSITION_NOT_FOUND`: Position does not exist

---

### Get Aggregate Positions

Get aggregated position data across all tracked wallets.

**Endpoint:** `GET /api/positions/aggregate`

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
        "poolAddress": "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
        "positionCount": 8,
        "totalValueUSD": 250000.00,
        "totalFeesUSD": 3120.45
      },
      {
        "pair": "USDC/USDT",
        "poolAddress": "0x...",
        "positionCount": 4,
        "totalValueUSD": 150000.00,
        "totalFeesUSD": 1500.22
      }
    ]
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

## Error Codes Reference

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing API key |
| `NOT_FOUND` | Endpoint not found |
| `MISSING_ADDRESS` | Required wallet address not provided |
| `INVALID_ADDRESS` | Invalid Ethereum address format |
| `WALLET_EXISTS` | Wallet already being tracked |
| `WALLET_NOT_FOUND` | Wallet address not found |
| `POSITION_NOT_FOUND` | Position does not exist |
| `SYNC_FAILED` | Failed to sync positions |
| `INTERNAL_ERROR` | Internal server error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 60 seconds
- **Max Requests**: 100 per window per IP

When rate limit is exceeded, you'll receive:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  },
  "timestamp": "2026-01-08T12:00:00.000Z"
}
```

---

## Best Practices

1. **Cache Responses**: Position data is updated every 5 minutes. Cache API responses accordingly.

2. **Batch Requests**: Instead of querying individual positions, use aggregate endpoints when possible.

3. **Error Handling**: Always check the `success` field and handle errors appropriately.

4. **API Key Security**: Never expose your API key in client-side code or public repositories.

5. **Pagination**: For large datasets, implement pagination on your end or contact us for pagination support.

---

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'your_api_key_here';

// Create wallet
async function createWallet(address, label) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/wallets`,
      { address, label },
      { headers: { 'x-api-key': API_KEY } }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Get positions
async function getPositions(walletAddress) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/positions`,
      {
        params: { wallet: walletAddress },
        headers: { 'x-api-key': API_KEY }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
createWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'My Wallet')
  .then(data => console.log('Created:', data));

getPositions('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
  .then(data => console.log('Positions:', data));
```

### Python

```python
import requests

API_BASE_URL = 'http://localhost:3000'
API_KEY = 'your_api_key_here'
HEADERS = {'x-api-key': API_KEY}

# Create wallet
def create_wallet(address, label):
    response = requests.post(
        f'{API_BASE_URL}/api/wallets',
        json={'address': address, 'label': label},
        headers=HEADERS
    )
    return response.json()

# Get positions
def get_positions(wallet_address):
    response = requests.get(
        f'{API_BASE_URL}/api/positions',
        params={'wallet': wallet_address},
        headers=HEADERS
    )
    return response.json()

# Usage
wallet = create_wallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'My Wallet')
print('Created:', wallet)

positions = get_positions('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
print('Positions:', positions)
```

---

## Support

For API issues or questions:
- Check the logs: `logs/app.log`
- Review this documentation
- Submit an issue on GitHub
