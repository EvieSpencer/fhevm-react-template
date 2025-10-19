# @privacy-bidding/fhevm-sdk

Universal SDK for fhEVM - Privacy-preserving construction bidding platform

## Features

- 🔐 **Fully Homomorphic Encryption** - Encrypt sensitive bid data
- ⚡ **Easy Integration** - Simple API for any dApp
- ⚛️ **React Hooks** - Ready-to-use React hooks
- 🎯 **Type Safe** - Full TypeScript support
- 🔌 **Framework Agnostic** - Core SDK works anywhere
- 📦 **Modular** - Import only what you need

## Installation

```bash
npm install @privacy-bidding/fhevm-sdk fhevmjs ethers
```

## Quick Start

### Core SDK (Framework Agnostic)

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

// Create provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Initialize fhEVM client
const client = createFhevmClient({
  provider,
  network: 'sepolia',
});

await client.initialize();

// Encrypt values
const encryptedAmount = await client.encrypt32(1000);
const encryptedTime = await client.encrypt32(30);

// Create decryption signature
const signature = await client.createDecryptionSignature(
  contractAddress,
  userAddress
);
```

### React Integration

```typescript
import { FhevmProvider, useEncrypt, useDecrypt } from '@privacy-bidding/fhevm-sdk/react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <BiddingForm />
    </FhevmProvider>
  );
}

function BiddingForm() {
  const { encrypt32, isEncrypting } = useEncrypt();
  const { createSignature } = useDecrypt();

  const handleSubmit = async () => {
    // Encrypt bid amount
    const encrypted = await encrypt32(bidAmount);

    if (encrypted) {
      // Submit to contract
      await contract.submitBid(projectId, encrypted.data, ...);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form */}
      {isEncrypting && <p>Encrypting...</p>}
    </form>
  );
}
```

## API Reference

### Core SDK

#### `createFhevmClient(config)`

Creates a new fhEVM client instance.

**Parameters:**
- `config.provider` - Ethers provider
- `config.network` - Network name ('sepolia' | 'localhost' | 'mainnet')
- `config.gatewayUrl` - (Optional) Custom gateway URL
- `config.aclAddress` - (Optional) ACL contract address

**Returns:** `FhevmClient`

#### `FhevmClient`

##### `initialize(): Promise<void>`

Initialize the client with FHE public keys.

##### `encrypt32(value: number): Promise<EncryptedInput>`

Encrypt a 32-bit unsigned integer.

##### `encrypt64(value: bigint): Promise<EncryptedInput>`

Encrypt a 64-bit unsigned integer (uses 32-bit for compatibility).

##### `createDecryptionSignature(contractAddress, userAddress): Promise<string>`

Create EIP-712 signature for decryption.

### React Hooks

#### `useFhevmClient()`

Access the fhEVM client instance.

**Returns:**
```typescript
{
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}
```

#### `useEncrypt()`

Hook for encryption operations.

**Returns:**
```typescript
{
  encrypt32: (value: number) => Promise<EncryptedInput | null>;
  encrypt64: (value: bigint) => Promise<EncryptedInput | null>;
  isEncrypting: boolean;
  error: Error | null;
}
```

#### `useDecrypt()`

Hook for decryption operations.

**Returns:**
```typescript
{
  createSignature: (contractAddress: string, userAddress: string) => Promise<string | null>;
  isDecrypting: boolean;
  error: Error | null;
}
```

#### `useEncryptedBid()`

Specialized hook for bid encryption.

**Returns:**
```typescript
{
  encryptBid: (bidAmount: number, completionTime: number) => Promise<{
    encryptedAmount: EncryptedInput;
    encryptedTime: EncryptedInput;
  } | null>;
  isProcessing: boolean;
  error: Error | null;
}
```

## Examples

### Encrypt and Submit Bid

```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';

async function submitEncryptedBid(
  projectId: number,
  bidAmount: number,
  completionTime: number,
  proposal: string
) {
  // Initialize client
  const client = createFhevmClient({ provider, network: 'sepolia' });
  await client.initialize();

  // Encrypt sensitive data
  const encryptedAmount = await client.encrypt32(bidAmount);
  const encryptedTime = await client.encrypt32(completionTime);

  // Submit to contract
  const tx = await contract.submitBid(
    projectId,
    encryptedAmount.data,
    encryptedTime.data,
    proposal
  );

  await tx.wait();
}
```

### React Component Example

```typescript
import { useEncryptedBid } from '@privacy-bidding/fhevm-sdk/react';

function BidSubmissionForm({ projectId, contract }) {
  const [bidAmount, setBidAmount] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [proposal, setProposal] = useState('');

  const { encryptBid, isProcessing, error } = useEncryptedBid();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Encrypt bid data
    const encrypted = await encryptBid(
      Number(bidAmount),
      Number(completionTime)
    );

    if (!encrypted) {
      alert('Encryption failed');
      return;
    }

    // Submit to contract
    const tx = await contract.submitBid(
      projectId,
      encrypted.encryptedAmount.data,
      encrypted.encryptedTime.data,
      proposal
    );

    await tx.wait();
    alert('Bid submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Bid Amount (ETH)"
      />
      <input
        type="number"
        value={completionTime}
        onChange={(e) => setCompletionTime(e.target.value)}
        placeholder="Completion Time (days)"
      />
      <textarea
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        placeholder="Your proposal"
      />
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Encrypting & Submitting...' : 'Submit Bid'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### Request Decryption

```typescript
import { useDecrypt } from '@privacy-bidding/fhevm-sdk/react';

function ViewBids({ projectId, contractAddress }) {
  const { createSignature } = useDecrypt();
  const [signature, setSignature] = useState('');

  const handleRequestDecryption = async () => {
    const sig = await createSignature(contractAddress, userAddress);
    if (sig) {
      setSignature(sig);
      // Use signature to request decryption from gateway
    }
  };

  return (
    <div>
      <button onClick={handleRequestDecryption}>
        View Encrypted Bids
      </button>
      {signature && <p>Signature: {signature}</p>}
    </div>
  );
}
```

## Utilities

The SDK includes helpful utility functions:

```typescript
import {
  toHex,
  fromHex,
  formatAddress,
  isValidAddress,
  retryWithBackoff
} from '@privacy-bidding/fhevm-sdk';

// Convert encrypted data to hex
const hex = toHex(encryptedData);

// Format address for display
const short = formatAddress('0x7f8117E01D7Cfc6F80eeeCe2416A084e6c0f8B46');
// Output: "0x7f81...8B46"

// Validate address
const valid = isValidAddress(userAddress);

// Retry with exponential backoff
const result = await retryWithBackoff(
  () => client.encrypt32(value),
  3, // max retries
  1000 // base delay in ms
);
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  FhevmConfig,
  EncryptedInput,
  DecryptionRequest,
  DecryptedResult,
  BidData,
  EncryptedBidData,
} from '@privacy-bidding/fhevm-sdk';
```

## Network Support

- ✅ Sepolia Testnet
- ✅ Local Hardhat
- 🔜 Mainnet (coming soon)
- 🔜 Zama Devnet

## Error Handling

```typescript
const { encrypt32, error } = useEncrypt();

try {
  const encrypted = await encrypt32(1000);
  if (!encrypted) {
    console.error('Encryption failed:', error);
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
```

## Performance

- Encryption time: ~100-300ms per value
- Concurrent encryption supported
- Automatic retry on network errors
- Optimized for large-scale applications

## Security

- End-to-end encryption using fhEVM
- EIP-712 signatures for decryption
- No plaintext data sent to blockchain
- Compatible with Zama's security model

## Contributing

See the main repository for contribution guidelines.

## License

MIT

## Links

- [Documentation](https://github.com/your-repo/docs)
- [Examples](https://github.com/your-repo/examples)
- [Zama fhEVM](https://docs.zama.ai/fhevm)

## Support

- GitHub Issues: [Report a bug](https://github.com/your-repo/issues)
- Discord: [Join community](https://discord.fhe.org)

---

**Built with ❤️ for privacy-preserving construction bidding**
