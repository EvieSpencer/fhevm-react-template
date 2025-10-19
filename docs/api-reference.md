# API Reference

Complete API documentation for @privacy-bidding/fhevm-sdk

## Core SDK

### `createFhevmClient(config)`

Creates a new FHE client instance.

**Parameters:**
- `config: FhevmConfig`
  - `provider: Provider` - Ethers provider instance
  - `network: 'sepolia' | 'localhost' | 'mainnet'` - Network name
  - `gatewayUrl?: string` - (Optional) Custom gateway URL
  - `aclAddress?: string` - (Optional) ACL contract address

**Returns:** `FhevmClient`

**Example:**
```typescript
import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const client = createFhevmClient({
  provider,
  network: 'sepolia'
});
```

---

### `FhevmClient`

Main client class for FHE operations.

#### `initialize(): Promise<void>`

Initialize the client with FHE public keys.

**Returns:** `Promise<void>`

**Example:**
```typescript
await client.initialize();
```

#### `encrypt32(value: number): Promise<EncryptedInput>`

Encrypt a 32-bit unsigned integer.

**Parameters:**
- `value: number` - Value to encrypt (0 to 2^32-1)

**Returns:** `Promise<EncryptedInput>`
```typescript
{
  data: Uint8Array;     // Encrypted data
  handles: string[];    // Encryption handles
}
```

**Example:**
```typescript
const encrypted = await client.encrypt32(1000);
console.log(encrypted.data); // Uint8Array
```

#### `encrypt64(value: bigint): Promise<EncryptedInput>`

Encrypt a 64-bit unsigned integer (actually uses 32-bit for compatibility).

**Parameters:**
- `value: bigint` - Value to encrypt

**Returns:** `Promise<EncryptedInput>`

**Example:**
```typescript
const encrypted = await client.encrypt64(1000n);
```

#### `createDecryptionSignature(contractAddress: string, userAddress: string): Promise<string>`

Create EIP-712 signature for decryption authorization.

**Parameters:**
- `contractAddress: string` - Smart contract address
- `userAddress: string` - User's wallet address

**Returns:** `Promise<string>` - Signature token

**Example:**
```typescript
const signature = await client.createDecryptionSignature(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
);
```

---

## React Hooks

### `FhevmProvider`

Provider component to wrap your application.

**Props:**
- `config: FhevmConfig` - Client configuration
- `children: React.ReactNode` - Child components

**Example:**
```typescript
import { FhevmProvider } from '@privacy-bidding/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  );
}
```

---

### `useFhevmClient()`

Access the FHE client instance.

**Returns:**
```typescript
{
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
import { useFhevmClient } from '@privacy-bidding/fhevm-sdk/react';

function MyComponent() {
  const { client, isInitialized, error } = useFhevmClient();

  if (!isInitialized) {
    return <div>Initializing FHE...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Use client
}
```

---

### `useEncrypt()`

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

**Example:**
```typescript
import { useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function EncryptionComponent() {
  const { encrypt32, isEncrypting, error } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1000);
    if (encrypted) {
      console.log('Encrypted:', encrypted.data);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

---

### `useDecrypt()`

Hook for decryption operations.

**Returns:**
```typescript
{
  createSignature: (
    contractAddress: string,
    userAddress: string
  ) => Promise<string | null>;
  isDecrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
import { useDecrypt } from '@privacy-bidding/fhevm-sdk/react';

function DecryptionComponent() {
  const { createSignature, isDecrypting } = useDecrypt();

  const handleDecrypt = async () => {
    const signature = await createSignature(
      contractAddress,
      userAddress
    );

    if (signature) {
      // Use signature for decryption request
    }
  };
}
```

---

### `useEncryptedBid()`

Specialized hook for encrypting bid data (amount + time).

**Returns:**
```typescript
{
  encryptBid: (
    bidAmount: number,
    completionTime: number
  ) => Promise<{
    encryptedAmount: EncryptedInput;
    encryptedTime: EncryptedInput;
  } | null>;
  isProcessing: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
import { useEncryptedBid } from '@privacy-bidding/fhevm-sdk/react';

function BidForm() {
  const { encryptBid, isProcessing } = useEncryptedBid();

  const handleSubmit = async () => {
    const encrypted = await encryptBid(1000, 30);

    if (encrypted) {
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

---

## Utility Functions

### `toHex(data: Uint8Array): string`

Convert encrypted data to hex string.

**Example:**
```typescript
import { toHex } from '@privacy-bidding/fhevm-sdk';

const hex = toHex(encrypted.data);
// Output: "0x1a2b3c..."
```

### `fromHex(hex: string): Uint8Array`

Convert hex string to Uint8Array.

**Example:**
```typescript
import { fromHex } from '@privacy-bidding/fhevm-sdk';

const bytes = fromHex('0x1a2b3c...');
```

### `formatAddress(address: string, chars?: number): string`

Format address for display.

**Parameters:**
- `address: string` - Ethereum address
- `chars?: number` - Number of chars to show (default: 4)

**Example:**
```typescript
import { formatAddress } from '@privacy-bidding/fhevm-sdk';

const short = formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
// Output: "0x742d...0bEb"
```

### `isValidAddress(address: string): boolean`

Validate Ethereum address.

**Example:**
```typescript
import { isValidAddress } from '@privacy-bidding/fhevm-sdk';

if (isValidAddress(userInput)) {
  // Valid address
}
```

### `sleep(ms: number): Promise<void>`

Sleep utility for delays.

**Example:**
```typescript
import { sleep } from '@privacy-bidding/fhevm-sdk';

await sleep(1000); // Wait 1 second
```

### `retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>`

Retry async function with exponential backoff.

**Parameters:**
- `fn: () => Promise<T>` - Function to retry
- `maxRetries?: number` - Max retry attempts (default: 3)
- `baseDelay?: number` - Base delay in ms (default: 1000)

**Example:**
```typescript
import { retryWithBackoff } from '@privacy-bidding/fhevm-sdk';

const result = await retryWithBackoff(
  () => client.encrypt32(value),
  3,
  1000
);
```

---

## TypeScript Types

### `FhevmConfig`

```typescript
interface FhevmConfig {
  provider: Provider;
  network: 'sepolia' | 'localhost' | 'mainnet';
  gatewayUrl?: string;
  aclAddress?: string;
}
```

### `EncryptedInput`

```typescript
interface EncryptedInput {
  data: Uint8Array;
  handles: string[];
}
```

### `DecryptionRequest`

```typescript
interface DecryptionRequest {
  contractAddress: string;
  userAddress: string;
  ciphertext: Uint8Array;
}
```

### `DecryptedResult`

```typescript
interface DecryptedResult {
  value: number | bigint;
  proof: string;
}
```

### `BidData`

```typescript
interface BidData {
  amount: number;
  completionTime: number;
  proposal: string;
}
```

### `EncryptedBidData`

```typescript
interface EncryptedBidData {
  encryptedAmount: EncryptedInput;
  encryptedTime: EncryptedInput;
  proposal: string;
}
```

### `EncryptionCallback`

```typescript
type EncryptionCallback = (
  encrypted: EncryptedInput
) => void | Promise<void>;
```

### `FhevmInstance`

```typescript
interface FhevmInstance {
  encrypt32(value: number): Uint8Array;
  encrypt64(value: bigint): Uint8Array;
  generateToken(params: { verifyingContract: string }): { token: string };
}
```

---

## Error Handling

All async functions may throw errors. Always handle errors appropriately:

```typescript
try {
  const encrypted = await client.encrypt32(value);
} catch (error) {
  console.error('Encryption failed:', error);
  // Handle error
}
```

With hooks, errors are returned:

```typescript
const { encrypt32, error } = useEncrypt();

const result = await encrypt32(value);
if (!result) {
  console.error('Encryption failed:', error);
}
```

---

## Advanced Usage

### Custom Gateway Configuration

```typescript
const client = createFhevmClient({
  provider,
  network: 'sepolia',
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...'
});
```

### Batch Encryption

```typescript
const { encrypt32 } = useEncrypt();

const values = [100, 200, 300, 400];
const encrypted = await Promise.all(
  values.map(v => encrypt32(v))
);
```

### Custom Error Handling

```typescript
const { encrypt32, error } = useEncrypt();

useEffect(() => {
  if (error) {
    // Custom error handling
    logErrorToService(error);
    showNotification('Encryption failed');
  }
}, [error]);
```

---

## Performance Considerations

- **Initialization**: ~1-2 seconds (one-time)
- **Encryption**: ~100-300ms per value
- **Batch operations**: Use `Promise.all()` for parallel encryption
- **Retry mechanism**: Built-in with exponential backoff

---

## Security Notes

- All encryption happens client-side
- Private keys never leave the user's device
- EIP-712 signatures required for decryption
- Compatible with Zama's security model
- No plaintext data on blockchain
