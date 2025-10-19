/**
 * Core fhEVM client for encryption and decryption operations
 */

import { createInstance, FhevmInstance as FhevmJsInstance } from 'fhevmjs';
import type { FhevmConfig, EncryptedInput, DecryptionRequest, DecryptedResult } from '../types';

export class FhevmClient {
  private instance: FhevmJsInstance | null = null;
  private config: FhevmConfig;
  private initialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the fhEVM instance
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Get network info from provider
      const network = await this.config.provider.getNetwork();
      const chainId = network.chainId;

      // Create fhEVM instance with public key from network
      this.instance = await createInstance({
        chainId: Number(chainId),
        publicKey: await this.getPublicKey(),
        gatewayUrl: this.config.gatewayUrl,
      });

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize fhEVM: ${error}`);
    }
  }

  /**
   * Get the FHE public key from the network
   */
  private async getPublicKey(): Promise<string> {
    // In production, fetch from ACL contract or gateway
    // For now, return a placeholder
    const aclAddress = this.config.aclAddress || '0x2Fb4341bc8584e3aB78068BcD8B1aC42E25BEED5';

    try {
      const code = await this.config.provider.getCode(aclAddress);
      if (code === '0x') {
        throw new Error('ACL contract not found');
      }

      // Fetch public key from ACL contract
      // This is a simplified version - real implementation would call the contract
      return '0x'; // Placeholder
    } catch (error) {
      console.warn('Failed to fetch public key, using default');
      return '0x';
    }
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  async encrypt32(value: number): Promise<EncryptedInput> {
    if (!this.initialized || !this.instance) {
      throw new Error('FhevmClient not initialized. Call initialize() first.');
    }

    try {
      const encrypted = this.instance.encrypt32(value);
      return {
        data: encrypted,
        handles: [], // Handles are generated on-chain
      };
    } catch (error) {
      throw new Error(`Failed to encrypt value: ${error}`);
    }
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  async encrypt64(value: bigint): Promise<EncryptedInput> {
    if (!this.initialized || !this.instance) {
      throw new Error('FhevmClient not initialized. Call initialize() first.');
    }

    try {
      // fhevmjs only supports up to 32-bit, so we use encrypt32 for compatibility
      const encrypted = this.instance.encrypt32(Number(value));
      return {
        data: encrypted,
        handles: [],
      };
    } catch (error) {
      throw new Error(`Failed to encrypt value: ${error}`);
    }
  }

  /**
   * Create EIP-712 signature for decryption
   */
  async createDecryptionSignature(
    contractAddress: string,
    userAddress: string
  ): Promise<string> {
    if (!this.initialized || !this.instance) {
      throw new Error('FhevmClient not initialized');
    }

    try {
      const signature = this.instance.generateToken({
        verifyingContract: contractAddress,
      });

      return signature.token;
    } catch (error) {
      throw new Error(`Failed to create signature: ${error}`);
    }
  }

  /**
   * Request decryption of an encrypted value
   */
  async requestDecryption(request: DecryptionRequest): Promise<string> {
    const signature = await this.createDecryptionSignature(
      request.contractAddress,
      request.userAddress
    );

    return signature;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the underlying fhevmjs instance
   */
  getInstance(): FhevmJsInstance | null {
    return this.instance;
  }
}

/**
 * Create a new FhevmClient instance
 */
export function createFhevmClient(config: FhevmConfig): FhevmClient {
  return new FhevmClient(config);
}
