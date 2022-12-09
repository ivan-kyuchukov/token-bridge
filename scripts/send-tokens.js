const hre = require("hardhat");
const ethers = hre.ethers;

const {
  ETH_NODE_API_URL,
  POLYGON_NODE_API_URL,
  WALLET_1_PRIVATE_KEY,
  WALLET_1_PUBLIC_KEY,
  WALLET_2_PRIVATE_KEY,
  WALLET_2_PUBLIC_KEY,
  ETH_BRIDGE_CONTRACT_ADDRESS,
  POL_BRIDGE_CONTRACT_ADDRESS,
} = process.env;

async function main() {
  const ethProvider = new hre.ethers.providers.JsonRpcProvider(
    ETH_NODE_API_URL
  );
  const ethAdmin = new ethers.Wallet(WALLET_1_PRIVATE_KEY, ethProvider);

  const polProvider = new hre.ethers.providers.JsonRpcProvider(
    POLYGON_NODE_API_URL
  );
  const polAdmin = new ethers.Wallet(WALLET_1_PRIVATE_KEY, polProvider);
  const polSecondAcc = new ethers.Wallet(WALLET_2_PRIVATE_KEY, polProvider);

  const bridgeFactory = await ethers.getContractFactory("Bridge");
  const ethBridge = await bridgeFactory.attach(ETH_BRIDGE_CONTRACT_ADDRESS);
  const polBridge = await bridgeFactory.attach(POL_BRIDGE_CONTRACT_ADDRESS);

  // Send from Ethereum admin (first acc) to Polygon second account
  const tx = await (
    await ethBridge.connect(ethAdmin).burn(WALLET_2_PUBLIC_KEY, 100)
  ).wait();

  // Send back from Polygon second account to ethereum admin (first acc)
  // const tx = await (
  //   await polBridge.connect(polSecondAcc).burn(WALLET_1_PUBLIC_KEY, 100)
  // ).wait();
}
main();
