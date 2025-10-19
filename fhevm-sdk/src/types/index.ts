/**
 * Core types for fhEVM SDK
 */

export interface FhevmConfig {
  provider: any; // ethers provider
  network: 'sepolia' | 'localhost' | 'mainnet';
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface EncryptedInput {
  data: Uint8Array;
  handles: bigint[];
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: bigint;
  userAddress: string;
}

export interface DecryptedResult {
  value: bigint | number | boolean;
  timestamp: number;
}

export interface BidData {
  projectId: number;
  bidAmount: bigint;
  completionTime: number;
  proposal: string;
}

export interface EncryptedBidData {
  projectId: number;
  encryptedAmount: Uint8Array;
  encryptedTime: Uint8Array;
  proposal: string;
}

export type EncryptionCallback = (progress: number) => void;

export interface FhevmInstance {
  encrypt32(value: number): Promise<EncryptedInput>;
  encrypt64(value: bigint): Promise<EncryptedInput>;
  decrypt(request: DecryptionRequest): Promise<DecryptedResult>;
  createEIP712Signature(data: any): Promise<string>;
}
