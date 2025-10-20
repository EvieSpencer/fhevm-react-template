# Getting Started with @privacy-bidding/fhevm-sdk

This guide will help you integrate the fhEVM SDK into your dApp for privacy-preserving operations.

## Prerequisites

- Node.js 18+
- Basic understanding of React (for React integration)
- MetaMask or other Web3 wallet
- Access to Sepolia testnet ETH (for testing)

## Installation

### 1. Install Dependencies

```bash
npm install @privacy-bidding/fhevm-sdk fhevmjs ethers
```

### 2. For React Projects

The SDK has peer dependencies on React 18+:

```bash
npm install react react-dom
```

## Basic Setup

### Framework-Agnostic Usage

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Create FHE client
const fheClient = createFhevmClient({
  provider,
  network: 'sepolia'
});

// Initialize
await fheClient.initialize();

// Now you can encrypt data
const encrypted = await fheClient.encrypt32(1000);
console.log('Encrypted data:', encrypted.data);
```

### React Integration

```typescript
import { FhevmProvider } from '@privacy-bidding/fhevm-sdk/react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  );
}
```

## Your First Encrypted Operation

### Example: Encrypt a Bid Amount

```typescript
import { useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function BidForm() {
  const { encrypt32, isEncrypting, error } = useEncrypt();
  const [bidAmount, setBidAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Encrypt the bid amount
    const encrypted = await encrypt32(Number(bidAmount));

    if (encrypted) {
      console.log('Encrypted bid:', encrypted.data);

      // Send to smart contract
      await contract.submitBid(projectId, encrypted.data);
    } else {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter bid amount"
      />
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit Bid'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

## Network Configuration

### Sepolia Testnet (Recommended for Testing)

```typescript
const client = createFhevmClient({
  provider,
  network: 'sepolia'
});
```

### Local Hardhat

```typescript
const client = createFhevmClient({
  provider,
  network: 'localhost',
  gatewayUrl: 'http://localhost:8545'
});
```

### Custom Configuration

```typescript
const client = createFhevmClient({
  provider,
  network: 'sepolia',
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...' // Custom ACL contract
});
```

## Smart Contract Integration

### 1. Deploy FHE-Enabled Contract

```solidity
import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";

contract MyContract {
    mapping(address => euint32) private encryptedBalances;

    function deposit(bytes calldata encryptedAmount) external {
        euint32 amount = FHE.asEuint32(encryptedAmount);
        encryptedBalances[msg.sender] = amount;
        FHE.allowThis(amount);
    }
}
```

### 2. Frontend Integration

```typescript
import { useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function DepositForm({ contract }) {
  const { encrypt32 } = useEncrypt();

  const handleDeposit = async (amount) => {
    // Encrypt amount
    const encrypted = await encrypt32(amount);

    // Call contract
    const tx = await contract.deposit(encrypted.data);
    await tx.wait();
  };
}
```

## Common Patterns

### Loading States

```typescript
function MyComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  return (
    <div>
      {isEncrypting && <Spinner />}
      <button disabled={isEncrypting}>
        Submit
      </button>
    </div>
  );
}
```

### Error Handling

```typescript
function MyComponent() {
  const { encrypt32, error } = useEncrypt();

  useEffect(() => {
    if (error) {
      console.error('Encryption error:', error);
      // Show notification to user
    }
  }, [error]);
}
```

### Concurrent Encryption

```typescript
const { encrypt32 } = useEncrypt();

// Encrypt multiple values in parallel
const [encAmount, encTime] = await Promise.all([
  encrypt32(bidAmount),
  encrypt32(completionTime)
]);
```

## Decryption

### Request Decryption

```typescript
import { useDecrypt } from '@privacy-bidding/fhevm-sdk/react';

function ViewBids({ contractAddress, userAddress }) {
  const { createSignature, isDecrypting } = useDecrypt();

  const handleViewBid = async () => {
    // Create EIP-712 signature
    const signature = await createSignature(contractAddress, userAddress);

    if (signature) {
      // Use signature to request decryption from gateway
      const response = await fetch('https://gateway.zama.ai/decrypt', {
        method: 'POST',
        body: JSON.stringify({ signature, ...requestData })
      });

      const decrypted = await response.json();
      console.log('Decrypted value:', decrypted);
    }
  };
}
```

## Best Practices

### 1. Initialize Once

```typescript
// ✅ Good - Initialize at app level
<FhevmProvider config={config}>
  <App />
</FhevmProvider>

// ❌ Bad - Re-initializing in components
function MyComponent() {
  const client = createFhevmClient(config); // Don't do this
}
```

### 2. Handle Errors Gracefully

```typescript
const { encrypt32, error } = useEncrypt();

const handleEncrypt = async (value) => {
  const result = await encrypt32(value);

  if (!result) {
    // Handle error
    alert('Encryption failed. Please try again.');
    console.error(error);
    return;
  }

  // Proceed with result
};
```

### 3. Show Loading States

```typescript
const { encrypt32, isEncrypting } = useEncrypt();

return (
  <button disabled={isEncrypting}>
    {isEncrypting ? 'Encrypting...' : 'Submit'}
  </button>
);
```

### 4. Validate Input

```typescript
const handleSubmit = async (value) => {
  // Validate before encrypting
  if (value < 0 || value > MAX_VALUE) {
    alert('Invalid value');
    return;
  }

  const encrypted = await encrypt32(value);
  // ...
};
```

## Troubleshooting

### SDK Not Initializing

**Problem**: `client` is null or undefined

**Solution**: Ensure FhevmProvider wraps your components:
```typescript
<FhevmProvider config={config}>
  <YourComponent />
</FhevmProvider>
```

### Encryption Takes Too Long

**Problem**: Encryption seems stuck

**Solution**:
- Check network connection
- Verify provider is connected
- Check browser console for errors
- SDK automatically retries with backoff

### TypeScript Errors

**Problem**: Type errors when importing

**Solution**: Ensure TypeScript can find type definitions:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## Example Applications

### Level 1: Basic Encryption
Location: `examples/basic-encryption/`

Framework-agnostic example showing core SDK usage:
```bash
cd examples/basic-encryption
npm install
npm start
```

### Level 2: React Integration
Location: `examples/react-integration/`

React hooks integration example:
```bash
cd examples/react-integration
npm install
npm start
```

### Level 3: Advanced Bidding
Location: `examples/advanced-usage/`

Complete bidding component with smart contract integration:
```bash
cd examples/advanced-usage
npm install
npm start
```

### Level 4: Full Production Application
Location: `examples/full-application/`

Complete production-ready single-page application with:
- Glassmorphism UI design
- Deployed smart contract on Sepolia
- Wallet integration and network detection
- Project management and bidding system
- Real-world use case demonstration

```bash
# Serve the application
npx http-server examples/full-application -p 8080

# Or open directly
open examples/full-application/index.html
```

Live Demo: [https://eviespencer.github.io/ConstructionBidding/](https://eviespencer.github.io/ConstructionBidding/)

See [examples/full-application/README.md](../examples/full-application/README.md) for complete documentation.

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](../examples/) - More code examples
- [Deployment Guide](./deployment-guide.md) - Deploy your dApp
- [SDK Architecture](../fhevm-sdk/README.md) - How the SDK works

## Need Help?

- [GitHub Issues](https://github.com/your-repo/issues)
- [Zama Discord](https://discord.fhe.org)
- [Documentation](https://docs.zama.ai/fhevm)
