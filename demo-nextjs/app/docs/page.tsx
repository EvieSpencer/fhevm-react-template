import Link from 'next/link'

export const metadata = {
  title: 'Documentation - FHEVM SDK',
  description: 'Complete documentation for the FHEVM SDK',
}

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">📚 Documentation</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <DocCard
          title="Getting Started"
          description="Quick start guide to get up and running in minutes"
          links={[
            { text: 'Installation', href: '#installation' },
            { text: 'Basic Setup', href: '#setup' },
            { text: 'First Encryption', href: '#first-encryption' },
          ]}
        />

        <DocCard
          title="API Reference"
          description="Complete API documentation for all SDK methods"
          links={[
            { text: 'Core SDK', href: '#core-sdk' },
            { text: 'React Hooks', href: '#react-hooks' },
            { text: 'Utilities', href: '#utilities' },
          ]}
        />

        <DocCard
          title="Code Examples"
          description="Practical examples for different use cases"
          links={[
            { text: 'Basic Encryption', href: '/examples#basic' },
            { text: 'React Integration', href: '/examples#react' },
            { text: 'Advanced Usage', href: '/examples#advanced' },
          ]}
        />

        <DocCard
          title="Deployment Guide"
          description="Deploy your FHEVM-powered application"
          links={[
            { text: 'Smart Contracts', href: '#contracts' },
            { text: 'Frontend', href: '#frontend' },
            { text: 'Production', href: '#production' },
          ]}
        />
      </div>

      {/* Quick Reference */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 id="installation" className="text-3xl font-bold mb-6 text-gray-900">Installation</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6">
          <code>npm install @privacy-bidding/fhevm-sdk fhevmjs ethers</code>
        </pre>

        <h2 id="setup" className="text-3xl font-bold mb-6 text-gray-900 mt-8">Basic Setup</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{`import { createFhevmClient } from '@privacy-bidding/fhevm-sdk';
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Create and initialize client
const client = createFhevmClient({
  provider,
  network: 'sepolia'
});

await client.initialize();

// Encrypt data
const encrypted = await client.encrypt32(1000);

// Use in contract
await contract.submitBid(projectId, encrypted.data);`}</code>
        </pre>

        <h2 id="core-sdk" className="text-3xl font-bold mb-6 text-gray-900 mt-8">Core SDK API</h2>
        <div className="space-y-4">
          <ApiMethod
            name="createFhevmClient(config)"
            description="Creates a new FHEVM client instance"
            params={[
              { name: 'config.provider', type: 'Provider', desc: 'Ethers provider' },
              { name: 'config.network', type: 'string', desc: "'sepolia' | 'localhost' | 'mainnet'" },
            ]}
            returns="FhevmClient"
          />

          <ApiMethod
            name="client.initialize()"
            description="Initialize the client with FHE public keys"
            returns="Promise<void>"
          />

          <ApiMethod
            name="client.encrypt32(value)"
            description="Encrypt a 32-bit unsigned integer"
            params={[
              { name: 'value', type: 'number', desc: 'Value to encrypt (0 to 2^32-1)' },
            ]}
            returns="Promise<EncryptedInput>"
          />

          <ApiMethod
            name="client.createDecryptionSignature(contractAddress, userAddress)"
            description="Create EIP-712 signature for decryption"
            params={[
              { name: 'contractAddress', type: 'string', desc: 'Smart contract address' },
              { name: 'userAddress', type: 'string', desc: "User's wallet address" },
            ]}
            returns="Promise<string>"
          />
        </div>

        <h2 id="react-hooks" className="text-3xl font-bold mb-6 text-gray-900 mt-8">React Hooks</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`import { FhevmProvider, useEncrypt } from '@privacy-bidding/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider config={{ provider, network: 'sepolia' }}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { encrypt32, isEncrypting, error } = useEncrypt();

  const handleEncrypt = async (value) => {
    const encrypted = await encrypt32(value);
    if (encrypted) {
      // Use encrypted data
    }
  };
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-3 text-gray-800">Available Hooks</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <code className="bg-gray-100 px-2 py-1 rounded">useFhevmClient()</code> - Access the FHE client</li>
          <li>• <code className="bg-gray-100 px-2 py-1 rounded">useEncrypt()</code> - Encrypt values</li>
          <li>• <code className="bg-gray-100 px-2 py-1 rounded">useDecrypt()</code> - Decrypt values</li>
          <li>• <code className="bg-gray-100 px-2 py-1 rounded">useEncryptedBid()</code> - Specialized bidding hook</li>
        </ul>
      </div>

      {/* External Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <ExternalLink
          title="GitHub Repository"
          description="View the source code and contribute"
          href="https://github.com/your-repo"
        />
        <ExternalLink
          title="Zama Documentation"
          description="Learn more about fhEVM technology"
          href="https://docs.zama.ai/fhevm"
        />
        <ExternalLink
          title="Live Demo"
          description="Try the SDK in action"
          href="/demo"
        />
      </div>
    </div>
  )
}

function DocCard({ title, description, links }: { title: string; description: string; links: Array<{ text: string; href: string }> }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="text-blue-600 hover:text-blue-800">
              {link.text} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ApiMethod({ name, description, params, returns }: {
  name: string;
  description: string;
  params?: Array<{ name: string; type: string; desc: string }>;
  returns: string;
}) {
  return (
    <div className="border-l-4 border-blue-600 pl-4 py-2">
      <code className="text-lg font-mono text-blue-600">{name}</code>
      <p className="text-gray-700 mt-2">{description}</p>
      {params && params.length > 0 && (
        <div className="mt-2">
          <strong className="text-sm text-gray-600">Parameters:</strong>
          <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
            {params.map((param, i) => (
              <li key={i}>
                <code className="text-purple-600">{param.name}</code>: <span className="text-gray-500">{param.type}</span> - {param.desc}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-2 text-sm text-gray-600">
        <strong>Returns:</strong> <code className="text-green-600">{returns}</code>
      </div>
    </div>
  )
}

function ExternalLink({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
    >
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 text-blue-600 font-semibold">
        View →
      </div>
    </a>
  )
}
