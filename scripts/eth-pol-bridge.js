const hre = require("hardhat");
const ethers = hre.ethers;

const {
  ETH_NODE_API_URL,
  POLYGON_NODE_API_URL,
  WALLET_1_PRIVATE_KEY,
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

  console.log(
    "Eth Lime SENDER Balance BEFORE: " +
      (await ethToken.connect(ethAdmin).balanceOf(ethAdmin.address))
  );
  console.log(
    "Pol Lime RECEIVER Balance BEFORE: " +
      (await polToken.connect(polAdmin).balanceOf(WALLET_2_PUBLIC_KEY))
  );

  const bridgeInterface = bridgeFactory.interface.format(
    ethers.utils.FormatTypes.json
  );

  const ethBridgeContract = new ethers.Contract(
    ethBridgeContractAddress,
    bridgeInterface,
    ethProvider
  );

  const polBridgeContract = new ethers.Contract(
    polBridgeContractAddress,
    bridgeInterface,
    polProvider
  );

  let filter = ethBridgeContract.filters.Transfer(
    null,
    null,
    null,
    null,
    null,
    0
  );

  ethBridgeContract.on(filter, async (from, to, amount, date, nonce, step) => {
    console.log(
      "Ethereum Burn Transfer Event",
      from,
      to,
      amount,
      date,
      nonce,
      step
    );

    const tx = await polBridge.connect(polAdmin).mint(to, amount, nonce);

    // LOGS
    console.log(
      "Eth Lime SENDER Balance AFTER: " +
        (await ethToken.connect(ethAdmin).balanceOf(ethAdmin.address))
    );
    console.log(
      "Pol Lime RECEIVER Balance AFTER: " +
        (await polToken.connect(polAdmin).balanceOf(WALLET_2_PUBLIC_KEY))
    );
  });

  polBridgeContract.on(filter, async (from, to, amount, date, nonce, step) => {
    console.log(
      "Polygon Burn Transfer Event",
      from,
      to,
      amount,
      date,
      nonce,
      step
    );

    const tx = await ethBridge.connect(ethAdmin).mint(to, amount, nonce);
    //console.log(await tx.wait());

    // LOGS
    console.log(
      "Pol Lime SENDER Balance AFTER: " +
        (await polToken.connect(polAdmin).balanceOf(WALLET_2_PUBLIC_KEY))
    );

    console.log(
      "Eth Lime RECEIVER Balance AFTER: " +
        (await ethToken.connect(ethAdmin).balanceOf(ethAdmin.address))
    );
  });
}
main();
