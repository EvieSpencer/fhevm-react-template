/**
 * Basic Encryption Example
 *
 * This example demonstrates how to use the fhEVM SDK
 * to encrypt data without React.
 */

import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

async function main() {
  console.log('🔐 Basic Encryption Example\n');

  // 1. Setup provider
  console.log('Step 1: Connecting to wallet...');
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  console.log('✓ Connected:', await signer.getAddress(), '\n');

  // 2. Create FHE client
  console.log('Step 2: Creating FHE client...');
  const fheClient = createFhevmClient({
    provider,
    network: 'sepolia'
  });
  console.log('✓ Client created\n');

  // 3. Initialize
  console.log('Step 3: Initializing FHE...');
  await fheClient.initialize();
  console.log('✓ FHE initialized\n');

  // 4. Encrypt a value
  console.log('Step 4: Encrypting value 1000...');
  const encrypted = await fheClient.encrypt32(1000);
  console.log('✓ Encrypted data:', encrypted.data);
  console.log('  Data length:', encrypted.data.length, 'bytes\n');

  // 5. Encrypt multiple values
  console.log('Step 5: Encrypting multiple values...');
  const values = [100, 200, 300, 400, 500];
  const encryptedValues = await Promise.all(
    values.map(v => fheClient.encrypt32(v))
  );
  console.log('✓ Encrypted', encryptedValues.length, 'values\n');

  // 6. Create decryption signature
  console.log('Step 6: Creating decryption signature...');
  const contractAddress = '0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE';
  const userAddress = await signer.getAddress();
  const signature = await fheClient.createDecryptionSignature(
    contractAddress,
    userAddress
  );
  console.log('✓ Signature created:', signature.substring(0, 50) + '...\n');

  console.log('✅ Example completed successfully!');
}

// Run the example
main().catch(console.error);
