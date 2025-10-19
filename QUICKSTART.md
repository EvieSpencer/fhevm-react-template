# Quick Start Guide

Get started with the fhEVM SDK in 5 minutes!

## 🚀 Installation

```bash
npm install @privacy-bidding/fhevm-sdk fhevmjs ethers
```

## 📝 Basic Usage (Any Framework)

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

// 1. Setup
const provider = new ethers.BrowserProvider(window.ethereum);
const client = createFhevmClient({ provider, network: 'sepolia' });

// 2. Initialize
await client.initialize();

// 3. Encrypt
const encrypted = await client.encrypt32(1000);

// 4. Use in contract
await contract.submitBid(projectId, encrypted.data);
```

## ⚛️ React Usage

```typescript
import { FhevmProvider, useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

// 1. Wrap your app
function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  );
}

// 2. Use hooks
function YourComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleSubmit = async (value) => {
    const encrypted = await encrypt32(value);
    if (encrypted) {
      await contract.submitBid(projectId, encrypted.data);
    }
  };

  return (
    <button onClick={() => handleSubmit(1000)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit Bid'}
    </button>
  );
}
```

## 📚 Next Steps

- **Full Documentation**: See [docs/getting-started.md](./docs/getting-started.md)
- **API Reference**: See [docs/api-reference.md](./docs/api-reference.md)
- **Examples**: Browse [examples/](./examples/) directory
- **Deployment**: Read [docs/deployment-guide.md](./docs/deployment-guide.md)

## 🔗 Important Links

- **Smart Contract**: [0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE](https://sepolia.etherscan.io/address/0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE)
- **Network**: Sepolia Testnet
- **fhEVM Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

## 🎯 Available Hooks

```typescript
// Access client
const { client, isInitialized, error } = useFhevmClient();

// Encrypt data
const { encrypt32, encrypt64, isEncrypting } = useEncrypt();

// Decrypt data
const { createSignature, isDecrypting } = useDecrypt();

// Encrypt bid (specialized)
const { encryptBid, isProcessing } = useEncryptedBid();
```

## 🛠️ Utilities

```typescript
import { toHex, formatAddress, isValidAddress, retryWithBackoff } from '@privacy-bidding/fhevm-sdk';

// Convert to hex
const hex = toHex(encrypted.data);

// Format address
const short = formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
// Output: "0x742d...0bEb"

// Validate address
if (isValidAddress(address)) { /* ... */ }

// Retry with backoff
const result = await retryWithBackoff(() => client.encrypt32(value));
```

## 💡 Common Patterns

### Error Handling

```typescript
const { encrypt32, error } = useEncrypt();

const encrypted = await encrypt32(value);
if (!encrypted) {
  console.error('Encryption failed:', error);
  // Handle error
}
```

### Loading States

```typescript
const { encrypt32, isEncrypting } = useEncrypt();

return (
  <div>
    {isEncrypting && <Spinner />}
    <button disabled={isEncrypting}>Submit</button>
  </div>
);
```

### Batch Encryption

```typescript
const { encrypt32 } = useEncrypt();

const [encAmount, encTime] = await Promise.all([
  encrypt32(bidAmount),
  encrypt32(completionTime)
]);
```

## 🔐 Smart Contract Integration

### Solidity Contract

```solidity
import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";

contract MyContract {
    function submitBid(bytes calldata encryptedAmount) external {
        euint32 amount = FHE.asEuint32(encryptedAmount);
        // Use encrypted value
    }
}
```

### Frontend Integration

```typescript
const { encrypt32 } = useEncrypt();

const handleSubmit = async (amount) => {
  const encrypted = await encrypt32(amount);
  const tx = await contract.submitBid(encrypted.data);
  await tx.wait();
};
```

## 📊 Performance

- **Initialization**: ~1-2 seconds (one-time)
- **Encryption**: ~100-300ms per value
- **Parallel**: Supported with `Promise.all()`

## 🔧 Configuration

```typescript
const client = createFhevmClient({
  provider: ethersProvider,
  network: 'sepolia',        // 'sepolia' | 'localhost' | 'mainnet'
  gatewayUrl: '...',         // Optional
  aclAddress: '0x...'        // Optional
});
```

## 🆘 Troubleshooting

### Client not initialized

```typescript
const { isInitialized } = useFhevmClient();

if (!isInitialized) {
  return <div>Loading...</div>;
}
```

### Wrong network

```typescript
const chainId = await provider.getNetwork();
if (chainId.chainId !== 11155111) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }]
  });
}
```

### No wallet

```typescript
if (!window.ethereum) {
  alert('Please install MetaMask');
  return;
}
```

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Examples**: [examples/](./examples/)
- **Issues**: GitHub Issues
- **Community**: Zama Discord

---

**Ready to build privacy-preserving dApps? Start coding! 🚀**

🔐 Privacy-First • ⚡ Fast • 💎 Simple
