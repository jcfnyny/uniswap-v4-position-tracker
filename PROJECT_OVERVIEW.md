# Uniswap V4 Position Tracker - Project Overview

## 📦 What's Included

This ZIP file contains a complete, production-ready backend server for tracking Uniswap V4 liquidity positions.

### Contract Addresses (Pre-configured)
- **Position Manager**: `0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e`
- **State View**: `0x7ffe42c4a5deea5b0fec41c94c136cf115597227`
- **The Graph API Key**: `3c36aaf072dcdac31d0dbbc9ca61dd93`

---

## 📁 Project Structure

```
uniswap-v4-position-tracker/
├── src/                          # Source code
│   ├── blockchain/              # Smart contract ABIs
│   │   └── abis/
│   │       ├── PositionManager.json
│   │       ├── StateView.json
│   │       └── ERC20.json
│   ├── config/                  # Configuration
│   │   ├── index.ts            # Main config
│   │   └── database.ts         # DB config
│   ├── controllers/             # Request handlers
│   │   ├── WalletController.ts
│   │   └── PositionController.ts
│   ├── models/                  # Database models
│   │   ├── Wallet.ts
│   │   ├── Position.ts
│   │   └── FeeCollectionEvent.ts
│   ├── routes/                  # API routes
│   │   ├── walletRoutes.ts
│   │   └── positionRoutes.ts
│   ├── services/                # Business logic
│   │   ├── BlockchainService.ts
│   │   ├── PositionService.ts
│   │   └── PriceService.ts
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utilities
│   ├── app.ts                   # Express app
│   └── index.ts                 # Entry point
├── tests/                       # Test files
│   └── unit/
│       └── BlockchainService.test.ts
├── docs/                        # Documentation
│   └── API_DOCUMENTATION.md
├── logs/                        # Application logs
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── jest.config.js              # Test config
├── README.md                    # Main documentation
├── SETUP_GUIDE.md              # Detailed setup instructions
├── test.http                   # API test file
└── LICENSE                     # MIT License
```

---

## 🚀 Quick Start (3 Steps)

### 1. Extract and Install
```bash
unzip uniswap-v4-position-tracker.zip
cd uniswap-v4-position-tracker
npm install
```

### 2. Setup Database
```bash
# Install PostgreSQL if needed
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE uniswap_tracker;
CREATE USER tracker_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE uniswap_tracker TO tracker_user;
\q
```

### 3. Configure and Run
```bash
# Edit .env file with your settings
nano .env

# Add your RPC URL from Alchemy/Infura
# Update database credentials

# Run in development mode
npm run dev
```

Server will start on http://localhost:3000

---

## 🔧 Configuration Required

### Essential Settings in `.env`

1. **API Key** (Change from default!)
   ```env
   API_KEY=your_secure_api_key_here
   ```

2. **RPC URLs** (Get from Alchemy/Infura)
   ```env
   ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
   ```

3. **Database** (Update if needed)
   ```env
   DB_PASSWORD=your_secure_password
   ```

### Already Configured (No changes needed)
- Uniswap V4 Position Manager address
- State View contract address
- The Graph API key

---

## 📚 Documentation Files

1. **README.md**
   - Overview and features
   - Installation instructions
   - API usage examples
   - Troubleshooting guide

2. **SETUP_GUIDE.md**
   - Step-by-step setup with VS Code
   - Claude Code integration
   - Database configuration
   - Testing instructions
   - Development workflow

3. **docs/API_DOCUMENTATION.md**
   - Complete API reference
   - All endpoints documented
   - Request/response examples
   - Error codes
   - Code examples in multiple languages

---

## 🎯 Key Features

✅ **Multi-Wallet Tracking**
- Add/remove wallet addresses
- Automatic position discovery
- Label and tag organization

✅ **Position Details**
- Real-time liquidity amounts
- Tick range and current tick
- In-range status
- Token pair information

✅ **Fee Tracking**
- Unclaimed fee calculation
- USD value conversion
- Historical fee collection
- Aggregate fee reporting

✅ **RESTful API**
- JSON responses
- API key authentication
- Error handling
- Rate limiting

✅ **Database Persistence**
- PostgreSQL storage
- TypeORM models
- Automatic sync
- Historical data

---

## 🔌 API Endpoints

### Wallets
- `POST /api/wallets` - Add wallet
- `GET /api/wallets` - List wallets
- `GET /api/wallets/:address` - Get wallet
- `DELETE /api/wallets/:address` - Remove wallet
- `POST /api/wallets/:address/sync` - Sync positions

### Positions
- `GET /api/positions` - All positions
- `GET /api/positions?wallet=0x...` - Wallet positions
- `GET /api/positions/:tokenId` - Position details
- `GET /api/positions/aggregate` - Aggregated data

### Health
- `GET /health` - Server status

---

## 🛠️ Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Blockchain**: ethers.js v6
- **Database**: PostgreSQL + TypeORM
- **Logging**: Winston
- **Testing**: Jest

---

## 📦 What Makes This Production-Ready

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint and Prettier configured
- ✅ Comprehensive error handling
- ✅ Structured logging
- ✅ Input validation

### Architecture
- ✅ Clean separation of concerns
- ✅ Service layer pattern
- ✅ Repository pattern with TypeORM
- ✅ Modular route structure
- ✅ Reusable utilities

### Security
- ✅ API key authentication
- ✅ Rate limiting
- ✅ Environment variable management
- ✅ SQL injection protection (via ORM)
- ✅ Helmet.js security headers

### Performance
- ✅ Price caching (5 minutes)
- ✅ Database indexing
- ✅ Async/await patterns
- ✅ Connection pooling
- ✅ Efficient queries

### Developer Experience
- ✅ Hot reload in development
- ✅ Comprehensive documentation
- ✅ Test examples included
- ✅ VS Code configuration
- ✅ REST Client test file

---

## 🧪 Testing

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Test API with REST Client
Open `test.http` in VS Code and click "Send Request" above each endpoint.

### Test API with cURL
```bash
# Health check
curl http://localhost:3000/health

# Create wallet
curl -X POST http://localhost:3000/api/wallets \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev_api_key_12345" \
  -d '{"address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

---

## 🔄 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```
Server restarts automatically on code changes.

### 2. Make Changes
Edit files in `src/` directory. TypeScript will be compiled automatically.

### 3. View Logs
```bash
tail -f logs/app.log      # Application logs
tail -f logs/error.log    # Error logs only
```

### 4. Test Changes
Use `test.http` file or cURL to test endpoints.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Database Connection Fails
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify credentials
psql -U tracker_user -d uniswap_tracker -h localhost
```

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
```

### TypeScript Errors
```bash
# Rebuild
rm -rf dist node_modules
npm install
npm run build
```

### RPC Errors
- Check RPC URL is correct
- Verify API key is valid
- Check rate limits

---

## 📈 Next Steps

### Immediate
1. Update `.env` with your values
2. Start the server
3. Test endpoints with `test.http`

### Short-term
1. Add your wallet addresses
2. Monitor positions
3. Set up automated syncing

### Long-term
1. Deploy to production
2. Add frontend dashboard
3. Implement analytics
4. Add notifications

---

## 🤝 Using Claude Code

This project is designed to work seamlessly with Claude Code for AI-assisted development.

### Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### Example Prompts
```
"Add a new endpoint to track historical fee earnings"
"Help me debug this error: [paste error]"
"Generate tests for the PositionService"
"Optimize the blockchain service for better performance"
```

See SETUP_GUIDE.md for detailed Claude Code instructions.

---

## 📝 Additional Resources

### External Documentation
- [Uniswap V4 Docs](https://docs.uniswap.org/contracts/v4/overview)
- [ethers.js Docs](https://docs.ethers.org/v6/)
- [TypeORM Docs](https://typeorm.io/)
- [Express.js Docs](https://expressjs.com/)

### Getting RPC URLs
1. **Alchemy**: https://www.alchemy.com/
2. **Infura**: https://infura.io/
3. **QuickNode**: https://www.quicknode.com/

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🎉 You're Ready to Go!

1. Extract the ZIP file
2. Follow SETUP_GUIDE.md
3. Start building!

The project is fully configured and ready to use. All Uniswap V4 contract addresses are already set up. You just need to:
- Add your RPC URL
- Update database credentials
- Change the API key
- Run `npm install && npm run dev`

Happy tracking! 🚀
