require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env" });
const { ETH_NODE_API_URL, POLYGON_NODE_API_URL, WALLET_1_PRIVATE_KEY } =
  process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    ethereum: {
      url: ETH_NODE_API_URL,
      accounts: [WALLET_1_PRIVATE_KEY],
    },
    polygon: {
      url: POLYGON_NODE_API_URL,
      accounts: [WALLET_1_PRIVATE_KEY],
    },
    hardhat: {
      mining: {
        auto: false,
        interval: [500, 1000],
      },
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

task("deploy-eth", "Deploys contracts").setAction(
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
