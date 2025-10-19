/**
 * React hooks for fhEVM operations
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { FhevmClient, createFhevmClient } from '../core/FhevmClient';
import type { FhevmConfig, EncryptedInput } from '../types';

// Context for sharing fhEVM client across components
interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

export const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isInitialized: false,
  error: null,
});

/**
 * Provider component for fhEVM
 */
export function FhevmProvider({
  config,
  children,
}: {
  config: FhevmConfig;
  children: React.ReactNode;
}) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const fhevmClient = createFhevmClient(config);
        await fhevmClient.initialize();
        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
      }
    }

    init();
  }, [config]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access fhEVM client
 */
export function useFhevmClient() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmClient must be used within FhevmProvider');
  }
  return context;
}

/**
 * Hook for encrypting values
 */
export function useEncrypt() {
  const { client, isInitialized } = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt32 = useCallback(
    async (value: number): Promise<EncryptedInput | null> => {
      if (!isInitialized || !client) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encrypt32(value);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const encrypt64 = useCallback(
    async (value: bigint): Promise<EncryptedInput | null> {
      if (!isInitialized || !client) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await client.encrypt64(value);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt32,
    encrypt64,
    isEncrypting,
    error,
  };
}

/**
 * Hook for decryption operations
 */
export function useDecrypt() {
  const { client, isInitialized } = useFhevmClient();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSignature = useCallback(
    async (contractAddress: string, userAddress: string): Promise<string | null> => {
      if (!isInitialized || !client) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const signature = await client.createDecryptionSignature(contractAddress, userAddress);
        return signature;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    createSignature,
    isDecrypting,
    error,
  };
}

/**
 * Hook for encrypted bid submission
 */
export function useEncryptedBid() {
  const { encrypt32 } = useEncrypt();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptBid = useCallback(
    async (bidAmount: number, completionTime: number) => {
      setIsProcessing(true);
      setError(null);

      try {
        const [encryptedAmount, encryptedTime] = await Promise.all([
          encrypt32(bidAmount),
          encrypt32(completionTime),
        ]);

        if (!encryptedAmount || !encryptedTime) {
          throw new Error('Encryption failed');
        }

        return {
          encryptedAmount,
          encryptedTime,
        };
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [encrypt32]
  );

  return {
    encryptBid,
    isProcessing,
    error,
  };
}
