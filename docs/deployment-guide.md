# Deployment Guide

Complete guide for deploying your fhEVM-powered dApp to production.

## Table of Contents

1. [Smart Contract Deployment](#smart-contract-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [SDK Integration](#sdk-integration)
4. [Production Checklist](#production-checklist)
5. [Troubleshooting](#troubleshooting)

---

## Smart Contract Deployment

### Prerequisites

- Funded wallet on target network (Sepolia for testing)
- RPC endpoint (Infura, Alchemy, or custom)
- Private key with sufficient ETH for gas

### 1. Configure Environment

Create `.env` file:

```bash
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key  # Optional, for verification
```

### 2. Install Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @fhevm/solidity@^0.9.0-1 @zama-fhe/oracle-solidity
```

### 3. Configure Hardhat

`hardhat.config.cjs`:

```javascript
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1  // Optimize for deployment size
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: 1000000000  // 1 Gwei - adjust as needed
    }
  }
};
```

### 4. Deploy Contract

```bash
npx hardhat run scripts/deploy-fhe.cjs --network sepolia
```

Expected output:
```
🚀 Deploying to Sepolia Testnet...
📝 Deployer: 0x...
💰 Balance: 0.0243 ETH

⛏️ Deploying PrivacyConstructionBidding...
✅ Contract deployed to: 0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE
📊 Gas used: 1,832,041
💵 Deployment cost: ~0.0018 ETH
```

### 5. Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

### Gas Optimization Tips

1. **Reduce Compiler Runs**: Set `runs: 1` for smaller bytecode
2. **Lower Gas Price**: Use 1 Gwei during low congestion
3. **Optimize Storage**: Minimize state variables
4. **Batch Operations**: Combine multiple calls

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Configure Project

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_CONTRACT_ADDRESS": "0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE",
    "VITE_NETWORK": "sepolia"
  }
}
```

#### 3. Deploy

```bash
vercel --prod
```

### Option 2: Netlify

#### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_CONTRACT_ADDRESS = "0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE"
  VITE_NETWORK = "sepolia"
```

#### 2. Deploy

```bash
netlify deploy --prod
```

### Option 3: IPFS (Decentralized)

#### 1. Build Project

```bash
npm run build
```

#### 2. Upload to IPFS

Using Fleek:
```bash
npm install -g @fleek-platform/cli
fleek sites deploy
```

Or Pinata:
```bash
# Upload dist folder to https://pinata.cloud
```

---

## SDK Integration

### Production Configuration

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';

// Use environment variables
const config = {
  provider: new ethers.BrowserProvider(window.ethereum),
  network: import.meta.env.VITE_NETWORK || 'sepolia',
  gatewayUrl: import.meta.env.VITE_GATEWAY_URL,
  aclAddress: import.meta.env.VITE_ACL_ADDRESS
};

const client = createFhevmClient(config);
```

### Environment Variables

Create `.env.production`:

```bash
VITE_CONTRACT_ADDRESS=0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE
VITE_NETWORK=sepolia
VITE_GATEWAY_URL=https://gateway.zama.ai
VITE_ACL_ADDRESS=0x...  # Optional
```

### Build for Production

```bash
# Install dependencies
npm install

# Build
npm run build

# Preview production build
npm run preview
```

---

## Production Checklist

### Security

- [ ] Never commit private keys to git
- [ ] Use environment variables for sensitive data
- [ ] Verify contract on Etherscan
- [ ] Audit smart contracts
- [ ] Test all encryption/decryption flows
- [ ] Implement rate limiting
- [ ] Add CORS policies
- [ ] Enable HTTPS

### Performance

- [ ] Enable code splitting
- [ ] Optimize bundle size
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Cache FHE client initialization
- [ ] Use CDN for static assets
- [ ] Compress images and assets

### User Experience

- [ ] Add wallet connection UI
- [ ] Show transaction progress
- [ ] Handle wallet errors gracefully
- [ ] Add network switching
- [ ] Display gas estimates
- [ ] Add confirmation dialogs
- [ ] Implement retry logic

### Testing

- [ ] Test on Sepolia testnet
- [ ] Test all user flows
- [ ] Test error scenarios
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Wallet compatibility (MetaMask, WalletConnect, etc.)

### Documentation

- [ ] User guide
- [ ] API documentation
- [ ] Troubleshooting guide
- [ ] FAQ section
- [ ] Video tutorials

---

## Network Configuration

### Sepolia Testnet (Testing)

```typescript
{
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  explorer: 'https://sepolia.etherscan.io',
  faucets: [
    'https://sepoliafaucet.com',
    'https://faucet.quicknode.com/ethereum/sepolia'
  ]
}
```

### Mainnet (Production - Coming Soon)

```typescript
{
  chainId: 1,
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
  explorer: 'https://etherscan.io',
  gatewayUrl: 'https://gateway.zama.ai'  // Update when available
}
```

---

## Monitoring & Analytics

### Contract Events

Monitor key events:

```javascript
contract.on('BidSubmitted', (projectId, bidder, event) => {
  console.log(`New bid: Project ${projectId}, Bidder ${bidder}`);
  // Log to analytics
});

contract.on('WinnerSelected', (projectId, winner, event) => {
  console.log(`Winner selected: Project ${projectId}, Winner ${winner}`);
  // Notify users
});
```

### Error Tracking

Use Sentry or similar:

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  tracesSampleRate: 1.0
});
```

### Analytics

Track user interactions:

```javascript
// Track encryption operations
analytics.track('Bid Encrypted', {
  projectId,
  timestamp: Date.now()
});

// Track successful submissions
analytics.track('Bid Submitted', {
  projectId,
  txHash,
  gasUsed
});
```

---

## Troubleshooting

### Common Deployment Issues

#### 1. Insufficient Gas

**Error**: `insufficient funds for gas`

**Solution**:
- Reduce gas price in `hardhat.config.cjs`
- Get more testnet ETH from faucets
- Optimize contract code

#### 2. RPC Rate Limiting

**Error**: `429 Too Many Requests`

**Solution**:
- Use paid RPC provider (Infura, Alchemy)
- Implement request caching
- Add retry logic with backoff

#### 3. Wallet Connection Fails

**Error**: `No ethereum provider found`

**Solution**:
```javascript
if (!window.ethereum) {
  alert('Please install MetaMask');
  return;
}
```

#### 4. Wrong Network

**Error**: `Please switch to Sepolia`

**Solution**:
```javascript
const chainId = await provider.getNetwork();
if (chainId.chainId !== 11155111) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }]  // 11155111 in hex
  });
}
```

#### 5. Encryption Timeout

**Error**: `Encryption timeout`

**Solution**:
- Check network connection
- Verify gateway URL
- Increase timeout in SDK config
- Use retry logic

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_CONTRACT_ADDRESS: ${{ secrets.CONTRACT_ADDRESS }}
          VITE_NETWORK: sepolia

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Support

If you encounter issues during deployment:

1. Check [GitHub Issues](https://github.com/your-repo/issues)
2. Join [Zama Discord](https://discord.fhe.org)
3. Review [fhEVM Documentation](https://docs.zama.ai/fhevm)
4. Contact support team

---

## Next Steps

After successful deployment:

1. Monitor contract events
2. Track user analytics
3. Gather user feedback
4. Plan feature updates
5. Optimize gas costs
6. Improve UX based on usage data

Good luck with your deployment! 🚀
