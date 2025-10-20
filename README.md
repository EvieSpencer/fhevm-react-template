# fhEVM React Template - Privacy-Preserving Construction Bidding SDK

A complete SDK and demo application for building privacy-preserving dApps using Zama's fhEVM (Fully Homomorphic Encryption for Ethereum Virtual Machine).

## 🏆 Competition Submission

This project demonstrates a production-ready SDK for fhEVM integration with:
- Universal, framework-agnostic core
- React hooks for easy integration
- Complete demo application
- Comprehensive documentation
- Real-world use case (construction bidding)

## 📁 Project Structure

```
fhevm-react-template/
├── fhevm-sdk/              # Core SDK package
│   ├── src/
│   │   ├── core/           # Framework-agnostic FHE client
│   │   ├── hooks/          # React hooks
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── demo/                   # Demo application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks using SDK
│   │   └── App.tsx         # Main application
│   └── package.json
│
├── examples/               # Usage examples
│   ├── basic-encryption/
│   ├── react-integration/
│   ├── advanced-usage/
│   └── full-application/   # Complete production example
│
└── docs/                   # Documentation
    ├── getting-started.md
    ├── api-reference.md
    └── deployment-guide.md
```

## 🚀 Quick Start

### Install SDK

```bash
npm install @privacy-bidding/fhevm-sdk fhevmjs ethers
```

### Basic Usage

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';

const client = createFhevmClient({
  provider: ethersProvider,
  network: 'sepolia'
});

await client.initialize();
const encrypted = await client.encrypt32(1000);
```

### React Integration

```typescript
import { FhevmProvider, useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const result = await encrypt32(sensitiveValue);
    // Use encrypted result
  };
}
```

## 🎯 Key Features

### 1. Framework-Agnostic Core
- Works with any JavaScript framework
- No dependencies on React or other UI libraries
- Pure TypeScript implementation

### 2. React Hooks Layer
- `useFhevmClient()` - Access FHE client
- `useEncrypt()` - Encrypt values
- `useDecrypt()` - Decrypt values
- `useEncryptedBid()` - Specialized bidding hook

### 3. Type Safety
- Full TypeScript support
- Comprehensive type definitions
- IntelliSense support

### 4. Production Ready
- Error handling
- Retry mechanisms
- Loading states
- Optimized performance

## 💡 Use Case: Privacy-Preserving Construction Bidding

This SDK powers a real-world construction bidding platform where:
- **Bid amounts** are encrypted (no one can see competitor bids)
- **Completion times** are encrypted
- **Smart contract** evaluates bids using FHE operations
- **Winner selection** happens on encrypted data
- **Decryption** only when authorized

### Smart Contract Integration

```solidity
contract PrivacyConstructionBidding {
    struct PrivateBid {
        euint32 encryptedAmount;
        euint32 encryptedCompletionTime;
        string proposal;
    }

    function submitBid(
        uint256 projectId,
        bytes calldata encryptedAmount,
        bytes calldata encryptedTime,
        string calldata proposal
    ) external {
        // Store encrypted bid
        euint32 encAmount = FHE.asEuint32(encryptedAmount);
        euint32 encTime = FHE.asEuint32(encryptedTime);

        // Process without decrypting
        privateBids[projectId][msg.sender] = PrivateBid({
            encryptedAmount: encAmount,
            encryptedCompletionTime: encTime,
            proposal: proposal
        });
    }
}
```

### Frontend Integration

```typescript
import { useEncryptedBid } from '@privacy-bidding/fhevm-sdk/react';

function BidForm({ projectId, contract }) {
  const { encryptBid, isProcessing } = useEncryptedBid();

  const handleSubmit = async (amount, time, proposal) => {
    // Encrypt sensitive data
    const encrypted = await encryptBid(amount, time);

    if (encrypted) {
      // Submit to blockchain
      await contract.submitBid(
        projectId,
        encrypted.encryptedAmount.data,
        encrypted.encryptedTime.data,
        proposal
      );
    }
  };
}
```

## 📊 Performance

- **Encryption time**: ~100-300ms per value
- **Concurrent operations**: Supported
- **Automatic retry**: Built-in with exponential backoff
- **Optimized bundle**: Tree-shakeable exports

## 🔒 Security

- End-to-end encryption using Zama's fhEVM
- EIP-712 signatures for decryption
- No plaintext data on blockchain
- Complies with Zama security model

## 🌐 Network Support

- ✅ Sepolia Testnet
- ✅ Local Hardhat
- 🔜 Mainnet (coming soon)
- 🔜 Zama Devnet

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [SDK Architecture](./fhevm-sdk/README.md)
- [Deployment Guide](./docs/deployment-guide.md)

## 🎬 Demo Applications

This project includes 4 levels of examples demonstrating different aspects and integration approaches:

### SDK-Integrated Examples (Levels 1-3)

These examples demonstrate **actual client-side encryption** using the SDK:

#### Level 1: Basic Encryption (`examples/basic-encryption/`)
Framework-agnostic core SDK usage without any UI framework.

#### Level 2: React Integration (`examples/react-integration/`)
React hooks integration with FhevmProvider and component-based encryption.

#### Level 3: Advanced Bidding (`examples/advanced-usage/`)
Complete bidding workflow with SDK integration and smart contract interaction.

### UI/UX Demo (Level 4)

#### Full Production Example (`examples/full-application/`)

A complete single-page application demonstrating **production UI/UX**:

**Important**: This is a UI/UX demonstration. The smart contract supports FHE, but the frontend currently uses plain values for demonstration. **For actual SDK-integrated encryption, see Levels 1-3 above.**

**Features**:
- Complete SPA with glassmorphism UI (2,500 lines)
- Deployed FHE-enabled contract on Sepolia
- Wallet connection and network detection
- Project management and bidding workflow
- Winner selection and contractor authorization
- Production-ready UI design

**Quick Start**:
```bash
# Serve the application
npx http-server examples/full-application -p 8080

# Or open index.html directly in your browser
open examples/full-application/index.html
```

**Live Demo**: [https://eviespencer.github.io/ConstructionBidding/](https://eviespencer.github.io/ConstructionBidding/)

**Video Demo**: demo1.mp4  demo2.mp4 demo3.mp4

**Why separate from SDK?**
- Standalone HTML file (no build tools)
- Demonstrates complete UI/UX flow
- SDK requires module bundlers
- See Levels 1-3 for SDK usage

See [examples/full-application/README.md](./examples/full-application/README.md) for complete documentation.

### Next.js Demo (Coming Soon)

A React/Next.js version using the SDK's React hooks:
```bash
cd demo-nextjs
npm install
npm run dev
```

## 🛠️ Development

### Build SDK
```bash
cd fhevm-sdk
npm install
npm run build
```

### Run Tests
```bash
npm test
```

### Deploy Contracts
```bash
npx hardhat run scripts/deploy-fhe.cjs --network sepolia
```

## 🤝 Contributing

Contributions welcome! Please see our contribution guidelines.

## 📄 License

MIT

## 🔗 Links

- [Live Demo](https://eviespencer.github.io/ConstructionBidding/)
- [Smart Contract on Sepolia](https://sepolia.etherscan.io/address/0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE)
- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [GitHub Repository](https://github.com/your-repo)

## 👥 Team

Built for the fhEVM SDK competition by the Privacy Bidding team.

---

**🔐 Privacy-First • 🚀 Production-Ready • 💎 Open Source**
