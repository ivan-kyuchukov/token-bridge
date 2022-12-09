const hre = require("hardhat");
const ethers = hre.ethers;

const {
  ETH_NODE_API_URL,
  POLYGON_NODE_API_URL,
  WALLET_1_PRIVATE_KEY,
  WALLET_2_PUBLIC_KEY,
  ETH_LIME_TOKEN_CONTRACT_ADDRESS,
  POL_LIME_TOKEN_CONTRACT_ADDRESS,
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

  const tokenFactory = await ethers.getContractFactory("LimeToken");
  const ethToken = await tokenFactory.attach(ETH_LIME_TOKEN_CONTRACT_ADDRESS);
  const polToken = await tokenFactory.attach(POL_LIME_TOKEN_CONTRACT_ADDRESS);

  const bridgeFactory = await ethers.getContractFactory("Bridge");
  const ethBridge = await bridgeFactory.attach(ETH_BRIDGE_CONTRACT_ADDRESS);
  const polBridge = await bridgeFactory.attach(POL_BRIDGE_CONTRACT_ADDRESS);

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
    ETH_BRIDGE_CONTRACT_ADDRESS,
    bridgeInterface,
    ethProvider
  );

  const polBridgeContract = new ethers.Contract(
    POL_BRIDGE_CONTRACT_ADDRESS,
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
    await tx.wait();

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
    await tx.wait();

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
