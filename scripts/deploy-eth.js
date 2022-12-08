const hre = require("hardhat");
const ethers = hre.ethers;

const { WALLET_1_PRIVATE_KEY, ETH_NODE_API_URL } = process.env;

async function deployContracts(args) {
  await hre.run("compile");

  const ethProvider = new hre.ethers.providers.JsonRpcProvider(
    ETH_NODE_API_URL
  );

  const admin = new ethers.Wallet(WALLET_1_PRIVATE_KEY, ethProvider);
  console.log(ethers.utils.formatEther(await admin.getBalance(), 18));

  console.log("Deploying Ethereum Token with the account:", admin.address);

  const contractFactory = await ethers.getContractFactory("LimeTokenEth");
  const token = await contractFactory.deploy("LimeToken", "LMT");
  console.log("Waiting for token deployment...");
  await token.deployed();

  console.log("Contract address: ", token.address);

  console.log("Minting..");
  try {
    await token.mint(admin.address, ethers.utils.parseEther("0.001"));
  } catch (error) {
    console.log(error);
  }

  // Bridge
  const bridgeFactory = await ethers.getContractFactory("BridgeBase");
  const bridge = await bridgeFactory.deploy(token.address);
  console.log("Waiting for bridge deployment...");
  await bridge.deployed();

  console.log("Bridge address: ", bridge.address);

  await token.transferOwnership(bridge.address);

  console.log("Done!");
}

module.exports = deployContracts;
