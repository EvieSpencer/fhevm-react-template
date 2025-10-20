require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1, // Optimize for deployment cost (smaller bytecode)
        // runs=1 minimizes deployment cost
        // Trade-off: slightly higher runtime gas costs
      },
      evmVersion: "cancun",
      // Enhanced security compiler settings
      metadata: {
        bytecodeHash: "none", // Reduce attack surface
        useLiteralContent: true // Include source in metadata
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata"
          ],
          "": ["ast"]
        }
      }
    }
  },

  networks: {
    // Sepolia 测试网配置
    sepolia: {
      url: process.env.RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 1000000000 // 1 Gwei - much lower gas price
    },

    // fhEVM Zama Sepolia 配置
    zamaDevnet: {
      url: "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
      gas: 8000000,
      gasPrice: "auto"
    },

    // 本地 Hardhat 网络
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
      gas: 12000000,
      blockGasLimit: 12000000
    },

    // 本地测试网络
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },

  // Etherscan 验证配置
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    }
  },

  // 路径配置
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  // Gas monitoring and DoS prevention
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    outputFile: "gas-report.txt",
    noColors: true,
    // DoS protection: Monitor gas usage patterns
    showTimeSpent: true,
    showMethodSig: true,
    excludeContracts: [],
    // Alert thresholds for gas monitoring
    maxMethodDiff: 10, // Alert if method gas changes by >10%
    maxDeploymentDiff: 10, // Alert if deployment gas changes by >10%
    // Performance metrics
    L1: "ethereum",
    L2: "optimism",
    L2Type: "optimism",
    // Security: Track gas-heavy operations
    rst: true, // Generate RST output
    rstTitle: "Gas Usage Security Audit"
  },

  // Mocha 测试配置
  mocha: {
    timeout: 100000
  }
};
