'use client'

/**
 * FHEVM SDK Demo Component
 *
 * This component demonstrates the complete integration of the FHEVM SDK
 * in a Next.js App Router application with:
 * - Wallet connection
 * - SDK initialization
 * - Encryption operations
 * - Smart contract interaction
 * - Decryption flow
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Contract ABI for the privacy-preserving bidding contract
const CONTRACT_ABI = [
  'function submitBid(uint256 projectId, bytes calldata encryptedAmount, bytes calldata encryptedTime, string calldata proposal) external',
  'function getBidEncrypted(uint256 projectId, address bidder) external view returns (bytes32, bytes32, string, bool, uint256)',
  'event BidSubmitted(uint256 indexed projectId, address indexed bidder)'
]

const CONTRACT_ADDRESS = '0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE'

// Import SDK dynamically (client-side only)
let createFhevmClient: any = null
if (typeof window !== 'undefined') {
  import('../../fhevm-sdk/src/index').then(module => {
    createFhevmClient = module.createFhevmClient
  })
}

export default function FhevmDemo() {
  // State management
  const [mounted, setMounted] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [provider, setProvider] = useState<any>(null)
  const [fhevmClient, setFhevmClient] = useState<any>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [bidAmount, setBidAmount] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [proposal, setProposal] = useState('')

  // Result state
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    try {
      setError('')

      if (!window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet')
        return
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setAccount(address)
      setProvider(provider)

      // Check network
      const network = await provider.getNetwork()
      if (network.chainId !== 11155111n) {
        setError('Please switch to Sepolia Testnet')
        return
      }

      // Initialize FHEVM client
      await initializeFhevm(provider)

      setSuccessMessage('Wallet connected successfully!')
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`)
    }
  }

  // Initialize FHEVM SDK
  const initializeFhevm = async (provider: any) => {
    try {
      setIsInitializing(true)
      setError('')

      if (!createFhevmClient) {
        const module = await import('../../fhevm-sdk/src/index')
        createFhevmClient = module.createFhevmClient
      }

      console.log('🔐 Initializing FHEVM client...')

      const client = createFhevmClient({
        provider,
        network: 'sepolia'
      })

      await client.initialize()

      setFhevmClient(client)
      console.log('✅ FHEVM client initialized')

    } catch (err: any) {
      console.error('FHEVM initialization error:', err)
      setError(`Failed to initialize FHEVM: ${err.message}`)
    } finally {
      setIsInitializing(false)
    }
  }

  // Submit encrypted bid
  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fhevmClient) {
      setError('FHEVM client not initialized')
      return
    }

    try {
      setIsEncrypting(true)
      setError('')
      setSuccessMessage('')
      setTxHash('')

      // Step 1: Encrypt data
      console.log('🔐 Encrypting bid data...')
      const encryptedAmount = await fhevmClient.encrypt32(Number(bidAmount))
      const encryptedTime = await fhevmClient.encrypt32(Number(completionTime))
      console.log('✅ Data encrypted')

      // Step 2: Get signer and contract
      setIsEncrypting(false)
      setIsSubmitting(true)

      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      // Step 3: Submit transaction
      console.log('📝 Submitting bid to blockchain...')
      const tx = await contract.submitBid(
        1, // projectId
        encryptedAmount.data,
        encryptedTime.data,
        proposal
      )

      console.log('⏳ Transaction sent:', tx.hash)
      setTxHash(tx.hash)

      // Step 4: Wait for confirmation
      await tx.wait()
      console.log('✅ Transaction confirmed!')

      setSuccessMessage('Bid submitted successfully! Your data is encrypted on-chain.')

      // Clear form
      setBidAmount('')
      setCompletionTime('')
      setProposal('')

    } catch (err: any) {
      console.error('Submission error:', err)
      setError(`Failed to submit bid: ${err.message}`)
    } finally {
      setIsEncrypting(false)
      setIsSubmitting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('')
    setProvider(null)
    setFhevmClient(null)
    setSuccessMessage('Wallet disconnected')
  }

  if (!mounted) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Connection Status</h2>

        {!account ? (
          <div>
            <p className="text-gray-600 mb-4">Connect your wallet to start using the FHEVM SDK</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Account</p>
                <p className="font-mono text-sm text-gray-900">{account}</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Disconnect
              </button>
            </div>

            {isInitializing && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded">
                🔄 Initializing FHEVM client...
              </div>
            )}

            {fhevmClient && !isInitializing && (
              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">
                ✅ FHEVM SDK ready for encryption
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bid Form */}
      {account && fhevmClient && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Submit Encrypted Bid</h2>

          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Bid Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10.5"
              />
              <p className="text-xs text-gray-500 mt-1">🔒 This value will be encrypted before submission</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱️ Completion Time (days)
              </label>
              <input
                type="number"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 30"
              />
              <p className="text-xs text-gray-500 mt-1">🔒 This value will be encrypted before submission</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Proposal Description
              </label>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your proposal..."
              />
              <p className="text-xs text-gray-500 mt-1">ℹ️ This will be stored as plaintext</p>
            </div>

            <button
              type="submit"
              disabled={isEncrypting || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {isEncrypting ? '🔐 Encrypting...' : isSubmitting ? '📤 Submitting...' : '🚀 Submit Encrypted Bid'}
            </button>
          </form>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <p className="text-green-800 font-semibold">Success!</p>
          <p className="text-green-700 text-sm mt-1">{successMessage}</p>
        </div>
      )}

      {/* Transaction Details */}
      {txHash && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-gray-900">Transaction Details</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Transaction Hash:</p>
            <code className="block bg-gray-100 p-3 rounded text-sm break-all">{txHash}</code>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              View on Etherscan →
            </a>
          </div>
        </div>
      )}

      {/* SDK Code Example */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3 text-white">Behind the Scenes: SDK Code</h3>
        <pre className="text-sm overflow-x-auto">
          <code>{`// 1. Initialize FHEVM client
const client = createFhevmClient({
  provider,
  network: 'sepolia'
});
await client.initialize();

// 2. Encrypt sensitive data
const encryptedAmount = await client.encrypt32(bidAmount);
const encryptedTime = await client.encrypt32(completionTime);

// 3. Submit to blockchain
await contract.submitBid(
  projectId,
  encryptedAmount.data,
  encryptedTime.data,
  proposal
);

// ✅ Done! Your bid is encrypted on-chain.`}</code>
        </pre>
      </div>
    </div>
  )
}
