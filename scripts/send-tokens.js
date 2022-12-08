const hre = require("hardhat");
const ethers = hre.ethers;

const {
  ETH_NODE_API_URL,
  POLYGON_NODE_API_URL,
  WALLET_1_PRIVATE_KEY,
  WALLET_1_PUBLIC_KEY,
  WALLET_2_PUBLIC_KEY,
} = process.env;

const ethLimeTokenContractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const polLimeTokenContractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ethBridgeContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const polBridgeContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const ethProvider = new hre.ethers.providers.JsonRpcProvider(
    ETH_NODE_API_URL
  );
  const ethAdmin = new ethers.Wallet(WALLET_1_PRIVATE_KEY, ethProvider);

  const polProvider = new hre.ethers.providers.JsonRpcProvider(
    POLYGON_NODE_API_URL
  );
  const polAdmin = new ethers.Wallet(WALLET_1_PRIVATE_KEY, polProvider);

  const ethTokenFactory = await ethers.getContractFactory("LimeTokenEth");
  const polTokenFactory = await ethers.getContractFactory("LimeTokenPol");
  const ethToken = await ethTokenFactory.attach(ethLimeTokenContractAddress);
  const polToken = await polTokenFactory.attach(polLimeTokenContractAddress);

  const bridgeFactory = await ethers.getContractFactory("BridgeBase");
  const ethBridge = await bridgeFactory.attach(ethBridgeContractAddress);
  const polBridge = await bridgeFactory.attach(polBridgeContractAddress);

  const tx = await (
    await ethBridge
      .connect(ethAdmin)
      .burn(WALLET_2_PUBLIC_KEY, ethers.utils.parseEther("0.0001"))
  ).wait();

  // const tx = await (
  //   await polBridge
  //     .connect(polAdmin)
  //     .burn(WALLET_1_PUBLIC_KEY, ethers.utils.parseEther("0.0001"))
  // ).wait();
}
main();
