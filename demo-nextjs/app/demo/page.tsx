import FhevmDemo from '@/components/FhevmDemo'
import Link from 'next/link'

export const metadata = {
  title: 'Live Demo - FHEVM SDK',
  description: 'Interactive demo of the FHEVM SDK for privacy-preserving construction bidding',
}

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎬 Live Demo
        </h1>
        <p className="text-xl text-gray-600">
          Experience the FHEVM SDK with a real privacy-preserving construction bidding application
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Connect Your Wallet to Start
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Make sure you have:</p>
              <ul className="list-disc list-inside mt-1">
                <li>MetaMask or compatible wallet installed</li>
                <li>Connected to Sepolia Testnet</li>
                <li>Some test ETH (get from faucet if needed)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Demo Component - Client Side */}
      <FhevmDemo />

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <InfoCard
          title="🔐 Client-Side Encryption"
          description="All sensitive data is encrypted in your browser before being sent to the blockchain."
        />
        <InfoCard
          title="⚡ Fast Setup"
          description="The SDK handles all the complexity. Just a few lines of code to get started."
        />
        <InfoCard
          title="🔒 Privacy Guaranteed"
          description="Bid amounts remain encrypted on-chain. Only authorized parties can decrypt."
        />
      </div>

      {/* How It Works */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">How It Works</h2>
        <div className="space-y-4">
          <Step
            number="1"
            title="Connect Wallet"
            description="Click 'Connect Wallet' to connect your MetaMask or compatible wallet"
          />
          <Step
            number="2"
            title="SDK Initialization"
            description="The FHEVM SDK automatically initializes and fetches FHE public keys"
          />
          <Step
            number="3"
            title="Enter Bid Data"
            description="Fill in your bid amount and completion time. This data will be encrypted"
          />
          <Step
            number="4"
            title="Encrypt & Submit"
            description="SDK encrypts your data client-side and submits to the smart contract"
          />
          <Step
            number="5"
            title="View Encrypted Data"
            description="See your encrypted bid on-chain. Values remain private!"
          />
        </div>
      </div>

      {/* Smart Contract Info */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Smart Contract Details</h2>
        <div className="space-y-2">
          <p><strong>Network:</strong> Sepolia Testnet</p>
          <p><strong>Contract Address:</strong></p>
          <code className="bg-white/20 px-3 py-1 rounded text-sm block mt-1 break-all">
            0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE
          </code>
          <a
            href="https://sepolia.etherscan.io/address/0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-white text-purple-600 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition"
          >
            View on Etherscan →
          </a>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="ml-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
    </div>
  )
}
