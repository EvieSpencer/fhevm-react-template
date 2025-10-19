/**
 * @privacy-bidding/fhevm-sdk
 *
 * Universal SDK for fhEVM - Privacy-preserving construction bidding
 *
 * @example
 * ```typescript
 * import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
 *
 * const client = createFhevmClient({ provider, network: 'sepolia' });
 * await client.initialize();
 *
 * const encrypted = await client.encrypt32(1000);
 * ```
 */

// Core
export { FhevmClient, createFhevmClient } from './core/FhevmClient';

// Types
export type {
  FhevmConfig,
  EncryptedInput,
  DecryptionRequest,
  DecryptedResult,
  BidData,
  EncryptedBidData,
  EncryptionCallback,
  FhevmInstance,
} from './types';

// Utils
export * from './utils';
