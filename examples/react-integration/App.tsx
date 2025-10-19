/**
 * React Integration Example
 *
 * This example shows how to integrate the fhEVM SDK
 * into a React application using hooks.
 */

import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  FhevmProvider,
  useEncrypt,
  useDecrypt,
  useFhevmClient
} from '@privacy-bidding/fhevm-sdk/react';

// Setup provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Main App with Provider
export default function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>🔐 fhEVM SDK React Example</h1>
        <InitializationStatus />
        <EncryptionExample />
        <DecryptionExample />
      </div>
    </FhevmProvider>
  );
}

// Show initialization status
function InitializationStatus() {
  const { isInitialized, error } = useFhevmClient();

  return (
    <div style={{
      padding: '15px',
      margin: '20px 0',
      borderRadius: '8px',
      background: isInitialized ? '#d4edda' : '#f8d7da',
      color: isInitialized ? '#155724' : '#721c24'
    }}>
      {isInitialized ? (
        <>✓ FHE Client Initialized</>
      ) : error ? (
        <>✗ Initialization Error: {error.message}</>
      ) : (
        <>⏳ Initializing FHE Client...</>
      )}
    </div>
  );
}

// Encryption example component
function EncryptionExample() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string>('');
  const { encrypt32, isEncrypting, error } = useEncrypt();

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();

    const encrypted = await encrypt32(Number(value));

    if (encrypted) {
      setResult(`Encrypted: ${encrypted.data.length} bytes`);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Encrypt a Value</h2>

      <form onSubmit={handleEncrypt}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '200px',
            marginRight: '10px'
          }}
        />

        <button
          type="submit"
          disabled={isEncrypting || !value}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: isEncrypting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isEncrypting ? 'not-allowed' : 'pointer'
          }}
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#e7f3ff',
          borderRadius: '4px'
        }}>
          {result}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#ffe7e7',
          color: '#d00',
          borderRadius: '4px'
        }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

// Decryption example component
function DecryptionExample() {
  const [signature, setSignature] = useState<string>('');
  const { createSignature, isDecrypting, error } = useDecrypt();

  const handleCreateSignature = async () => {
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const contractAddress = '0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE';

    const sig = await createSignature(contractAddress, userAddress);

    if (sig) {
      setSignature(sig);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Create Decryption Signature</h2>

      <button
        onClick={handleCreateSignature}
        disabled={isDecrypting}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: isDecrypting ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isDecrypting ? 'not-allowed' : 'pointer'
        }}
      >
        {isDecrypting ? 'Creating...' : 'Create Signature'}
      </button>

      {signature && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#e7f3ff',
          borderRadius: '4px',
          wordBreak: 'break-all',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <strong>Signature:</strong><br />
          {signature}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#ffe7e7',
          color: '#d00',
          borderRadius: '4px'
        }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
