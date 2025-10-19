/**
 * React-specific exports
 *
 * @example
 * ```typescript
 * import { FhevmProvider, useEncrypt } from '@privacy-bidding/fhevm-sdk/react';
 *
 * function App() {
 *   return (
 *     <FhevmProvider config={{ provider, network: 'sepolia' }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 *
 * function YourComponent() {
 *   const { encrypt32, isEncrypting } = useEncrypt();
 *   // Use encryption...
 * }
 * ```
 */

export {
  FhevmProvider,
  FhevmContext,
  useFhevmClient,
  useEncrypt,
  useDecrypt,
  useEncryptedBid,
} from './hooks/useFhevm';

export type { FhevmConfig } from './types';
