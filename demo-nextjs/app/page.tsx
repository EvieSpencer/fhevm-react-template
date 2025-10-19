import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🔐 FHEVM SDK Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Universal SDK for building privacy-preserving dApps with Fully Homomorphic Encryption
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/demo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Try Live Demo
          </Link>
          <Link
            href="/docs"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            View Documentation
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon="🚀"
          title="Quick Setup"
          description="Get started in less than 10 lines of code. No complex configuration needed."
        />
        <FeatureCard
          icon="🔧"
          title="Framework Agnostic"
          description="Works with React, Vue, Next.js, or any JavaScript framework."
        />
        <FeatureCard
          icon="⚛️"
          title="React Hooks"
          description="Ready-to-use hooks: useEncrypt, useDecrypt, useEncryptedBid."
        />
        <FeatureCard
          icon="🔐"
          title="End-to-End Encryption"
          description="Client-side encryption using Zama's fhEVM technology."
        />
        <FeatureCard
          icon="📝"
          title="TypeScript First"
          description="Full TypeScript support with comprehensive type definitions."
        />
        <FeatureCard
          icon="🎯"
          title="Production Ready"
          description="Error handling, retry logic, and loading states built-in."
        />
      </div>

      {/* Quick Start Code Example */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Quick Start</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">1. Install</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <code>npm install @privacy-bidding/fhevm-sdk fhevmjs ethers</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">2. Use Anywhere</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';

const client = createFhevmClient({ provider, network: 'sepolia' });
await client.initialize();
const encrypted = await client.encrypt32(1000);`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">3. React Integration</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`import { FhevmProvider, useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();
  // Use encryption...
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Use Case Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white mb-16">
        <h2 className="text-3xl font-bold mb-4">Real-World Use Case</h2>
        <p className="text-lg mb-4">
          <strong>Privacy-Preserving Construction Bidding Platform</strong>
        </p>
        <ul className="space-y-2 text-lg">
          <li>✓ Bid amounts encrypted client-side</li>
          <li>✓ Smart contract evaluates encrypted values</li>
          <li>✓ Winner selection without decrypting all bids</li>
          <li>✓ Deployed on Sepolia Testnet</li>
        </ul>
        <div className="mt-6">
          <Link
            href="/demo"
            className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            Try It Now →
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <StatCard number="<10" label="Lines to Start" />
        <StatCard number="3,000+" label="Lines of Docs" />
        <StatCard number="100%" label="TypeScript" />
        <StatCard number="0x...30DE" label="Live Contract" />
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <NavCard
          href="/demo"
          title="Live Demo"
          description="Try the SDK with a real construction bidding application"
          icon="🎬"
        />
        <NavCard
          href="/docs"
          title="Documentation"
          description="Complete API reference and integration guides"
          icon="📚"
        />
        <NavCard
          href="/examples"
          title="Code Examples"
          description="Learn from practical examples at different levels"
          icon="💡"
        />
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

function NavCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-blue-600 font-semibold">
        Learn more →
      </div>
    </Link>
  )
}
