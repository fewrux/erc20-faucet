require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    // bscscan: process.env.BSCSCAN_API_URL,
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    bsctest: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC
        },
        providerOrUrl: process.env.BSC_URL,
      }),
      network_id: "*",
    },
    sepolia: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC
        },
        providerOrUrl: process.env.SEPOLIA_URL,
      }),
      network_id: "*",
    },
    ganache: {
      host: "172.21.208.1",
      port: 7545,
      network_id: "*",
      networkCheckTimeout: 1000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
