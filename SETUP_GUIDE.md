# Uniswap V4 Position Tracker - Complete Setup Guide

## Quick Start with VS Code and Claude Code

### Step 1: Prerequisites Installation

#### Install Node.js
```bash
# Check if installed
node --version
npm --version

# If not installed, download from nodejs.org or:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@14
brew services start postgresql@14

# Verify installation
psql --version
```

### Step 2: Database Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@14  # macOS

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE uniswap_tracker;
CREATE USER tracker_user WITH ENCRYPTED PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE uniswap_tracker TO tracker_user;
ALTER DATABASE uniswap_tracker OWNER TO tracker_user;
\c uniswap_tracker
GRANT ALL ON SCHEMA public TO tracker_user;
\q
EOF

# Test connection
psql -U tracker_user -d uniswap_tracker -h localhost
# Password: secure_password_123
```

### Step 3: Project Setup

#### Extract the ZIP file
```bash
# Navigate to where you extracted the ZIP
cd /path/to/uniswap-v4-position-tracker

# Verify structure
ls -la
```

#### Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment

```bash
# The .env file is already included, but update it with your values
nano .env
```

**Update these critical values:**

```env
# Change the API key to something secure
API_KEY=your_very_secure_api_key_change_this

# Add your RPC URLs (get from Alchemy or Infura)
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY
BASE_RPC_URL=https://base-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_KEY

# Update database credentials if you changed them
DB_USER=tracker_user
DB_PASSWORD=secure_password_123
```

**Get RPC URLs:**
1. Go to https://www.alchemy.com/
2. Sign up for free account
3. Create a new app for Ethereum Mainnet
4. Copy the HTTPS URL
5. Repeat for Base and Arbitrum if needed

### Step 5: Open in VS Code

```bash
# Open project in VS Code
code .
```

#### Install VS Code Extensions
In VS Code, press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) and install:
- **ESLint**
- **Prettier - Code formatter**
- **REST Client** (for testing APIs)
- **Thunder Client** (alternative API testing)
- **TypeScript and JavaScript Language Features** (built-in)

### Step 6: Build and Run

#### Option A: Development Mode (with auto-reload)
```bash
npm run dev
```

You should see:
```
=================================
🚀 Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
📍 Position Manager: 0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e
📍 State View: 0x7ffe42c4a5deea5b0fec41c94c136cf115597227
=================================
✅ Database connection established
✅ Blockchain providers initialized
✅ Smart contracts initialized
```

#### Option B: Production Build
```bash
npm run build
npm start
```

### Step 7: Test the API

#### Using cURL (Terminal)

```bash
# 1. Health Check (no API key needed)
curl http://localhost:3000/health

# 2. Create a wallet
curl -X POST http://localhost:3000/api/wallets \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_very_secure_api_key_change_this" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "label": "Test Wallet"
  }'

# 3. Get all wallets
curl http://localhost:3000/api/wallets \
  -H "x-api-key: your_very_secure_api_key_change_this"

# 4. Sync positions for a wallet
curl -X POST http://localhost:3000/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/sync \
  -H "x-api-key: your_very_secure_api_key_change_this"

# 5. Get positions
curl "http://localhost:3000/api/positions?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -H "x-api-key: your_very_secure_api_key_change_this"

# 6. Get aggregate data
curl http://localhost:3000/api/positions/aggregate \
  -H "x-api-key: your_very_secure_api_key_change_this"
```

#### Using VS Code REST Client

Create a file `test.http` in your project root:

```http
### Variables
@baseUrl = http://localhost:3000
@apiKey = your_very_secure_api_key_change_this

### Health Check
GET {{baseUrl}}/health

### Create Wallet
POST {{baseUrl}}/api/wallets
Content-Type: application/json
x-api-key: {{apiKey}}

{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "label": "My Test Wallet",
  "tags": ["test", "main"]
}

### Get All Wallets
GET {{baseUrl}}/api/wallets
x-api-key: {{apiKey}}

### Get Wallet by Address
GET {{baseUrl}}/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
x-api-key: {{apiKey}}

### Sync Wallet Positions
POST {{baseUrl}}/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/sync
x-api-key: {{apiKey}}

### Get Positions for Wallet
GET {{baseUrl}}/api/positions?wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
x-api-key: {{apiKey}}

### Get All Positions
GET {{baseUrl}}/api/positions
x-api-key: {{apiKey}}

### Get Position by Token ID
GET {{baseUrl}}/api/positions/12345
x-api-key: {{apiKey}}

### Get Aggregate Positions
GET {{baseUrl}}/api/positions/aggregate
x-api-key: {{apiKey}}

### Delete Wallet
DELETE {{baseUrl}}/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
x-api-key: {{apiKey}}
```

Click "Send Request" above each request to test.

---

## Using Claude Code for Development

### What is Claude Code?

Claude Code is an AI coding assistant that can help you:
- Write new features
- Debug issues
- Refactor code
- Write tests
- Generate documentation

### Installing Claude Code

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude-code --version
```

### Using Claude Code in VS Code

1. **Start Claude Code in Terminal**
   ```bash
   # In your project directory
   claude-code
   ```

2. **Or use the VS Code Extension**
   - Install "Claude Code" extension from VS Code marketplace
   - Open command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type "Claude Code: Start"

### Example Claude Code Prompts for This Project

#### Add New Feature
```
Add a new endpoint to get historical fee collection data for a position.
Create:
1. New route at GET /api/positions/:tokenId/fees/history
2. Controller method to fetch from FeeCollectionEvent model
3. Include date range filtering with query params
```

#### Debug Issue
```
I'm getting an error when fetching positions. The error is:
[paste error]
Help me debug and fix this issue.
```

#### Add Tests
```
Generate unit tests for the BlockchainService class.
Include tests for:
- Provider initialization
- getPositionTokenIds method
- Error handling
Use Jest framework.
```

#### Improve Code
```
Review the PositionService.ts file and suggest improvements for:
- Performance optimization
- Error handling
- Code organization
```

---

## Development Workflow

### 1. Making Changes

```bash
# Start development server
npm run dev

# Edit files in src/
# Server automatically restarts on changes
```

### 2. Checking Logs

```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

### 3. Database Management

```bash
# Connect to database
psql -U tracker_user -d uniswap_tracker -h localhost

# View tables
\dt

# View wallet data
SELECT * FROM wallets;

# View positions
SELECT * FROM positions;

# Exit
\q
```

### 4. Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type checking
npx tsc --noEmit
```

---

## Common Issues and Solutions

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start it
sudo systemctl start postgresql

# Verify credentials in .env match database
psql -U tracker_user -d uniswap_tracker -h localhost
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### Issue: "Cannot find module"

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: "RPC provider error"

**Solution:**
- Check your RPC URL is correct
- Verify API key is valid
- Check rate limits on Alchemy/Infura dashboard
- Try different RPC provider

### Issue: "TypeScript errors"

**Solution:**
```bash
# Rebuild
npm run build

# Clear TypeScript cache
rm -rf dist/
npm run build
```

---

## Next Steps

### Extend Functionality

1. **Add The Graph Integration**
   ```
   Create a new service GraphService.ts to query Uniswap V4 subgraph
   Use the GRAPH_API_KEY from .env
   ```

2. **Add Real-time Updates**
   ```
   Implement WebSocket support using socket.io
   Emit position updates when fees accrue
   ```

3. **Add Analytics Endpoints**
   ```
   Create AnalyticsController with:
   - Daily fee earnings
   - APR/APY calculations
   - Impermanent loss tracking
   ```

4. **Add Automated Syncing**
   ```
   Use node-cron to automatically sync positions every 5 minutes
   ```

### Production Deployment

1. **Environment Setup**
   - Set NODE_ENV=production
   - Use strong API keys
   - Configure HTTPS
   - Set up proper logging

2. **Database**
   - Use managed PostgreSQL (AWS RDS, DigitalOcean)
   - Enable backups
   - Set up replication

3. **Hosting Options**
   - Railway.app (easiest)
   - Heroku
   - AWS EC2
   - DigitalOcean Droplet
   - Vercel (serverless)

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Application monitoring (Datadog, New Relic)
   - Uptime monitoring (UptimeRobot)

---

## VS Code Keyboard Shortcuts

- `Ctrl/Cmd + `` - Toggle terminal
- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `F5` - Start debugging
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + /` - Toggle comment
- `Alt + Up/Down` - Move line up/down

---

## Resources

- **Uniswap V4 Docs**: https://docs.uniswap.org/contracts/v4/overview
- **ethers.js Docs**: https://docs.ethers.org/v6/
- **TypeORM Docs**: https://typeorm.io/
- **Express.js Docs**: https://expressjs.com/
- **The Graph Docs**: https://thegraph.com/docs/

---

## Support

If you encounter issues:
1. Check the logs: `logs/app.log` and `logs/error.log`
2. Review the README.md
3. Check environment variables in `.env`
4. Verify database connection
5. Test RPC endpoints

Happy coding! 🚀
