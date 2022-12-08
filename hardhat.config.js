require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env" });
const {
  ETH_NODE_API_URL,
  POLYGON_NODE_API_URL,
  INFURA_POLYGON_API_URL,
  WALLET_1_PRIVATE_KEY,
  ADMIN_WALLET_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: ETH_NODE_API_URL,
      accounts: [ADMIN_WALLET_PRIVATE_KEY],
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: ETH_NODE_API_URL,
      accounts: [ADMIN_WALLET_PRIVATE_KEY],
      allowUnlimitedContractSize: true,
    },
    localhost: {
      allowUnlimitedContractSize: true,
    },
    localhost2: {
      url: POLYGON_NODE_API_URL,
      accounts: [WALLET_1_PRIVATE_KEY],
    },
    polygon: {
      url: INFURA_POLYGON_API_URL,
      accounts: [ADMIN_WALLET_PRIVATE_KEY],
    },
    hardhat: {
      mining: {
        auto: false,
        interval: [3000, 5000],
      },
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "goerli",
        chainId: 5,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io",
        },
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

task("deploy-eth", "Deploys all contracts").setAction(
  async (taskArgs, hre, runSuper) => {
    const deployContracts = require("./scripts/deploy-eth");
    await deployContracts(taskArgs);
  }
);

task("deploy-pol", "Deploys contracts").setAction(
  async (taskArgs, hre, runSuper) => {
    const deployContracts = require("./scripts/deploy-pol");
    await deployContracts(taskArgs);
  }
);
