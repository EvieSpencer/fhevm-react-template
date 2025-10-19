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
│   └── advanced-usage/
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

## 🎬 Demo Application

A complete working demo is included showing:
- Project creation with encrypted requirements
- Bid submission with FHE
- Encrypted bid viewing
- Winner selection on encrypted data
- Decryption with proper authorization

Run the demo:
```bash
cd demo
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
