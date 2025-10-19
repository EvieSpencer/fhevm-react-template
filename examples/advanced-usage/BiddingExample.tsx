/**
 * Advanced Usage Example: Construction Bidding
 *
 * This example demonstrates a complete bidding flow
 * using the fhEVM SDK with smart contract integration.
 */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  FhevmProvider,
  useEncryptedBid,
  useDecrypt,
  useFhevmClient
} from '@privacy-bidding/fhevm-sdk/react';

// Contract ABI (simplified)
const CONTRACT_ABI = [
  'function submitBid(uint256 projectId, bytes calldata encryptedAmount, bytes calldata encryptedTime, string calldata proposal) external',
  'function getBidEncrypted(uint256 projectId, address bidder) external view returns (bytes32, bytes32, string, bool, uint256)',
  'function selectWinner(uint256 projectId, address winner) external',
  'event BidSubmitted(uint256 indexed projectId, address indexed bidder)'
];

const CONTRACT_ADDRESS = '0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE';
const provider = new ethers.BrowserProvider(window.ethereum);

export default function BiddingApp() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1>🏗️ Privacy-Preserving Construction Bidding</h1>
        <BidSubmissionForm projectId={1} />
        <ViewBidsSection projectId={1} />
      </div>
    </FhevmProvider>
  );
}

// Bid submission form
function BidSubmissionForm({ projectId }: { projectId: number }) {
  const [bidAmount, setBidAmount] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [proposal, setProposal] = useState('');
  const [txHash, setTxHash] = useState('');

  const { encryptBid, isProcessing, error } = useEncryptedBid();
  const { isInitialized } = useFhevmClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Encrypt bid data
      console.log('Encrypting bid data...');
      const encrypted = await encryptBid(
        Number(bidAmount),
        Number(completionTime)
      );

      if (!encrypted) {
        alert('Encryption failed');
        return;
      }

      console.log('Bid encrypted successfully');

      // Step 2: Connect to contract
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Step 3: Submit to blockchain
      console.log('Submitting to blockchain...');
      const tx = await contract.submitBid(
        projectId,
        encrypted.encryptedAmount.data,
        encrypted.encryptedTime.data,
        proposal
      );

      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);

      // Step 4: Wait for confirmation
      await tx.wait();
      console.log('Transaction confirmed!');

      alert('Bid submitted successfully!');

      // Clear form
      setBidAmount('');
      setCompletionTime('');
      setProposal('');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit bid: ' + (err as Error).message);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      border: '2px solid #007bff',
      borderRadius: '12px',
      background: '#f8f9fa'
    }}>
      <h2>Submit Your Bid</h2>

      {!isInitialized && (
        <div style={{ padding: '10px', background: '#fff3cd', marginBottom: '15px' }}>
          ⏳ Initializing encryption system...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            💰 Bid Amount (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="e.g., 10.5"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666' }}>
            🔒 This value will be encrypted before submission
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ⏱️ Completion Time (days)
          </label>
          <input
            type="number"
            value={completionTime}
            onChange={(e) => setCompletionTime(e.target.value)}
            placeholder="e.g., 30"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666' }}>
            🔒 This value will be encrypted before submission
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            📝 Proposal Description
          </label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Describe your proposal..."
            required
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <small style={{ color: '#666' }}>
            ℹ️ This will be stored as plaintext
          </small>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !isInitialized}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: isProcessing ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? '🔐 Encrypting & Submitting...' : '🚀 Submit Encrypted Bid'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px'
        }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {txHash && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '8px'
        }}>
          <strong>Transaction Hash:</strong><br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: 'break-all' }}
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

// View encrypted bids section
function ViewBidsSection({ projectId }: { projectId: number }) {
  const [bidData, setBidData] = useState<any>(null);
  const [signature, setSignature] = useState('');

  const { createSignature, isDecrypting } = useDecrypt();

  const handleRequestDecryption = async () => {
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const sig = await createSignature(CONTRACT_ADDRESS, userAddress);

    if (sig) {
      setSignature(sig);
      alert('Decryption signature created! In production, you would send this to the Zama gateway.');
    }
  };

  const handleViewBid = async () => {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const userAddress = await signer.getAddress();
      const result = await contract.getBidEncrypted(projectId, userAddress);

      setBidData({
        encryptedAmount: result[0],
        encryptedTime: result[1],
        proposal: result[2],
        submitted: result[3],
        timestamp: Number(result[4])
      });
    } catch (err) {
      console.error('Error fetching bid:', err);
      alert('Failed to fetch bid data');
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      border: '2px solid #28a745',
      borderRadius: '12px',
      background: '#f8f9fa'
    }}>
      <h2>View Your Encrypted Bid</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleViewBid}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          📊 Load Bid Data
        </button>

        <button
          onClick={handleRequestDecryption}
          disabled={isDecrypting}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            background: isDecrypting ? '#6c757d' : '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isDecrypting ? 'not-allowed' : 'pointer'
          }}
        >
          {isDecrypting ? '⏳ Creating...' : '🔓 Request Decryption'}
        </button>
      </div>

      {bidData && (
        <div style={{
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3>Bid Information</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            <p><strong>Encrypted Amount:</strong><br />{bidData.encryptedAmount}</p>
            <p><strong>Encrypted Time:</strong><br />{bidData.encryptedTime}</p>
            <p><strong>Proposal:</strong><br />{bidData.proposal}</p>
            <p><strong>Submitted:</strong> {bidData.submitted ? 'Yes' : 'No'}</p>
            <p><strong>Timestamp:</strong> {new Date(bidData.timestamp * 1000).toLocaleString()}</p>
          </div>
        </div>
      )}

      {signature && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px'
        }}>
          <h4>Decryption Signature</h4>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            wordBreak: 'break-all',
            background: 'white',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {signature}
          </p>
          <small>
            Send this signature to the Zama gateway to decrypt your bid data
          </small>
        </div>
      )}
    </div>
  );
}
