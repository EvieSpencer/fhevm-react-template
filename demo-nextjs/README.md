# FHEVM SDK - Next.js Demo

Next.js App Router demo showcasing the universal FHEVM SDK for building privacy-preserving dApps.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd demo-nextjs
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Connect Wallet

- Make sure MetaMask is installed
- Switch to Sepolia Testnet
- Connect your wallet in the demo

## 📁 Project Structure

```
demo-nextjs/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── demo/              # Live demo
│   │   └── page.tsx       # Demo page (Server Component)
│   ├── docs/              # Documentation
│   │   └── page.tsx       # Docs page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/            # React Components
│   └── FhevmDemo.tsx     # Main demo component (Client Component)
│
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## 🎯 Key Features

### Server Components
- **app/page.tsx** - Static home page (Server Component)
- **app/demo/page.tsx** - Demo page with SEO metadata (Server Component)
- **app/docs/page.tsx** - Documentation page (Server Component)

### Client Components
- **components/FhevmDemo.tsx** - Interactive demo using FHEVM SDK (Client Component)
  - Wallet connection
  - SDK initialization
  - Real-time encryption
  - Transaction submission

## 🔧 FHEVM SDK Integration

### Import SDK

```typescript
'use client'

import { createFhevmClient } from '../../fhevm-sdk/src/index'
```

### Initialize Client

```typescript
const client = createFhevmClient({
  provider: ethersProvider,
  network: 'sepolia'
})

await client.initialize()
```

### Encrypt Data

```typescript
const encrypted = await client.encrypt32(bidAmount)
```

### Submit to Blockchain

```typescript
const tx = await contract.submitBid(
  projectId,
  encrypted.data,
  encryptedTime.data,
  proposal
)
```

## 🌐 Pages

### Home (`/`)
- Feature overview
- Quick start guide
- Code examples
- Navigation to demo and docs

### Live Demo (`/demo`)
- Interactive wallet connection
- Real-time encryption demonstration
- Smart contract interaction
- Transaction tracking

### Documentation (`/docs`)
- Complete API reference
- Installation guide
- Code examples
- External resources

## 🎨 Styling

This demo uses **Tailwind CSS** for styling:

- Responsive design
- Modern UI components
- Custom color palette
- Smooth transitions

## 📦 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 🚢 Deploy

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🔐 Smart Contract

**Network**: Sepolia Testnet
**Address**: `0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE`

[View on Etherscan](https://sepolia.etherscan.io/address/0xAD4f8099219E6aa0fB556eB6CC51A670682d30DE)

## 📚 Learn More

- [FHEVM SDK Documentation](../docs/)
- [Zama Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)

## 🛠️ Technologies Used

- **Next.js 15** - App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ethers.js v6** - Ethereum interaction
- **fhevmjs** - Client-side encryption
- **FHEVM SDK** - Universal encryption SDK

## 📝 Key Code Examples

### Server Component (app/demo/page.tsx)

```typescript
// Server Component - renders on server
export const metadata = {
  title: 'Live Demo - FHEVM SDK',
  description: 'Interactive demo...',
}

export default function DemoPage() {
  return <FhevmDemo /> // Client component
}
```

### Client Component (components/FhevmDemo.tsx)

```typescript
'use client' // Client Component directive

export default function FhevmDemo() {
  const [fhevmClient, setFhevmClient] = useState(null)

  // Initialize SDK
  const initializeFhevm = async (provider) => {
    const client = createFhevmClient({ provider, network: 'sepolia' })
    await client.initialize()
    setFhevmClient(client)
  }

  // Encrypt and submit
  const handleSubmit = async () => {
    const encrypted = await fhevmClient.encrypt32(value)
    await contract.submitBid(projectId, encrypted.data)
  }

  return (/* JSX */)
}
```

## 🎬 Demo Flow

1. **User lands on home page** (Server Component)
2. **Clicks "Try Live Demo"** → Navigates to `/demo`
3. **Demo page loads** (Server Component with metadata)
4. **Interactive demo renders** (Client Component)
5. **User connects wallet** → MetaMask popup
6. **SDK initializes** → Fetches FHE public keys
7. **User enters bid data** → Form validation
8. **Clicks submit** → SDK encrypts client-side
9. **Transaction sent** → MetaMask confirmation
10. **Transaction confirmed** → Success message + Etherscan link

## ⚡ Performance

- **Server-side rendering** for SEO and fast initial load
- **Client-side interactivity** for wallet and encryption
- **Code splitting** for optimized bundle size
- **Static optimization** for pages without dynamic data

## 🐛 Troubleshooting

### SDK not loading
- Make sure you're in a client component (`'use client'`)
- Check browser console for errors
- Verify fhevm-sdk path is correct

### Wallet connection fails
- Ensure MetaMask is installed
- Check you're on Sepolia Testnet
- Make sure you have some test ETH

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `npm install`
- Check TypeScript errors: `npm run build`

## 📞 Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Zama Discord](https://discord.fhe.org)
- [Documentation](../docs/)

---

**Built with ❤️ for the FHEVM SDK Competition**

🔐 Privacy-First • ⚡ Next.js • 💎 Open Source
