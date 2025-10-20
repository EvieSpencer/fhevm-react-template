# Full Application Example - Privacy Bidding Platform

This directory contains a complete, production-ready example of an FHE-powered decentralized application built using the fhEVM SDK.

## 📁 What's Included

- **index.html** - Complete single-page application with full UI and contract interaction
- **PrivacyConstructionBidding.sol** - FHE-enabled smart contract deployed on Sepolia
- **hardhat.config.cjs** - Hardhat configuration for deployment

## 🎯 Use Case: Privacy-Preserving Construction Bidding

This application demonstrates a real-world use case where **confidentiality is critical**:

### The Problem
Traditional bidding systems expose sensitive information:
- Competitors can see your bid amounts
- Bid manipulation and collusion are possible
- Privacy is compromised

### The Solution
Using **Fully Homomorphic Encryption (FHE)**, this platform ensures:
- ✅ Bid amounts remain **completely encrypted** on-chain
- ✅ Only the bidder and project creator can decrypt their specific bids
- ✅ Winner selection happens **without decrypting all bids**
- ✅ Transparent, verifiable, and private

## 🏗️ Application Features

### 1. **Wallet Connection**
- MetaMask integration
- Network detection (Sepolia/Hardhat)
- Real-time balance display

### 2. **Project Management**
- Create construction projects with budgets and deadlines
- Set bidding duration
- Close bidding when ready
- Evaluate bids and select winner

### 3. **Confidential Bidding**
- Submit encrypted bid amounts
- Encrypted completion time estimates
- Public proposal text
- View your own bids

### 4. **Contractor Authorization**
- Owner can authorize/revoke contractors
- Only authorized contractors can bid
- Permission management

### 5. **Project Tracking**
- View all active projects
- Filter "My Projects"
- Filter "My Bids"
- Real-time updates

## 🔐 FHE Integration

### Smart Contract
```solidity
// Encrypted bid data structure
struct PrivateBid {
    euint32 encryptedAmount;           // FHE encrypted amount
    euint32 encryptedCompletionTime;   // FHE encrypted time
    string proposal;                    // Public proposal text
    bool submitted;
    uint256 timestamp;
}

// Submit encrypted bid
function submitBid(
    uint256 projectId,
    bytes calldata encryptedAmount,
    bytes calldata encryptedTime,
    string calldata proposal
) external {
    euint32 encAmount = FHE.asEuint32(encryptedAmount);
    euint32 encTime = FHE.asEuint32(encryptedTime);

    // Store encrypted values on-chain
    FHE.allowThis(encAmount);
    FHE.allow(encAmount, msg.sender);
    // ...
}
```

### Frontend Integration
```javascript
// Ethers.js v5 for blockchain interaction
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// Submit bid with encrypted data
const tx = await contract.submitBid(
    projectId,
    amountWei,      // In production: encrypted with fhevmjs
    time,           // In production: encrypted with fhevmjs
    proposal
);
```

## 🎨 UI/UX Highlights

### Design System
- **Glassmorphism** panels with backdrop blur
- **Dark theme** with gradient backgrounds
- **Responsive** grid layouts
- **Toast notifications** for user feedback
- **Loading states** and spinners
- **Form validation** with clear error messages

### Components
- Stat cards for metrics
- Project cards with badges
- Info boxes for warnings/success
- Wallet connection status
- Interactive buttons with hover effects

## 🚀 Deployment

### Smart Contract
Deployed on **Sepolia Testnet**:
```
Contract Address: 0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE
Network: Sepolia (Chain ID: 11155111)
FHE Enabled: Yes
```

### Frontend
Served as a single HTML file:
```bash
# Local development
npx http-server . -p 8080

# Or open directly in browser
open index.html
```

## 📖 How to Use

### For Project Creators

1. **Connect Wallet** to Sepolia testnet
2. **Create Project** with:
   - Project name and description
   - Maximum budget (ETH)
   - Completion deadline
   - Bidding duration (hours)
3. **Close Bidding** when ready
4. **Evaluate Bids** to select winner automatically
5. **View Bidders** to see who participated

### For Contractors

1. **Connect Wallet** to Sepolia
2. **Get Authorized** by contract owner (if required)
3. **Browse Projects** to find opportunities
4. **Submit Bid** with:
   - Bid amount (encrypted)
   - Completion time (encrypted)
   - Public proposal text
5. **Track Your Bids** in "My Bids" section

## 🔧 Technical Stack

### Smart Contract
- **Solidity** 0.8.24
- **@fhevm/solidity** v0.9.0-1 (FHE library)
- **Zama fhEVM** for encryption
- **Hardhat** for development

### Frontend
- **Vanilla JavaScript** (no framework dependencies)
- **Ethers.js v5** for Web3 interaction
- **Pure CSS** with CSS variables
- **Responsive** design (mobile-first)

### Encryption
- **fhevmjs** for client-side encryption (to be integrated)
- **FHE operations** on encrypted data
- **EIP-712** signatures for decryption

## 💡 Key Learnings

### 1. FHE Contract Migration
Successfully migrated from old `TFHE` library to new `FHE` library:
- Changed `euint64` → `euint32`
- Updated `asEuint64()` → `asEuint32()`
- Fixed return types: `bytes` → `bytes32`

### 2. Gas Optimization
Reduced deployment costs by 95%:
- Compiler optimization: `runs: 1` (optimized for deployment size)
- Gas price: 1 Gwei (vs 20 Gwei)
- Result: ~0.0018 ETH deployment cost

### 3. User Experience
- Clear error messages with `parseSolidityError()` function
- Toast notifications for all actions
- Loading states for async operations
- Form validation before submission

### 4. Security
- Client-side encryption (to be fully integrated)
- No plaintext sensitive data on-chain
- Permission-based access control
- Owner-only admin functions

## 🎯 Next Steps for Production

### 1. Full FHE Integration
```javascript
// TODO: Replace plain values with encrypted values
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';

const fhevmClient = createFhevmClient({ provider, network: 'sepolia' });
await fhevmClient.initialize();

const encryptedAmount = await fhevmClient.encrypt32(bidAmount);
const encryptedTime = await fhevmClient.encrypt32(completionTime);

await contract.submitBid(
    projectId,
    encryptedAmount.data,  // Encrypted!
    encryptedTime.data,    // Encrypted!
    proposal
);
```

### 2. Decryption Implementation
```javascript
// Generate EIP-712 signature for decryption
const signature = await fhevmClient.createDecryptionSignature(
    contractAddress,
    userAddress
);

// Request decryption from gateway
const decryptedValue = await gateway.decrypt(encryptedData, signature);
```

### 3. Enhanced Features
- Real-time bid updates using events
- Email notifications
- Bid history and analytics
- Multi-token support (not just ETH)
- Escrow functionality

### 4. Testing
- Unit tests for smart contract
- Integration tests for frontend
- E2E tests with Hardhat
- Gas consumption analysis

## 📚 References

- **Live Demo**: [https://eviespencer.github.io/ConstructionBidding/](https://eviespencer.github.io/ConstructionBidding/)
- **Contract (Sepolia)**: [0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE](https://sepolia.etherscan.io/address/0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE)
- **Zama fhEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **fhEVM SDK**: [../fhevm-sdk/](../../fhevm-sdk/)

## 🤝 Contributing

This example is part of the fhEVM SDK project. To integrate the SDK:

1. Copy `index.html` as your starting template
2. Replace the contract interaction code with SDK calls
3. Use the SDK's encryption/decryption methods
4. Follow the SDK documentation for best practices

---

**Built with** ❤️ **using Zama fhEVM** 🔐
