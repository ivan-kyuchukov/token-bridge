# Basic Token Bridge PoC

Startup commands:

```shell
Install
npm install

Open Terminal 1 - start a first (lets say ethereum) node
npx hardhat node

T2 - start a second (lets say polygon) node
npx hardhat node --port 8546

T3 - deploy token and bridge to ethereum node
npx hardhat deploy-eth --network ethereum

T4 - deploy token and bridge to polygon node
npx hardhat deploy-pol --network polygon

T5 - start the bridge api which listens bidirectionally for transfer (burn) tokens events and mints new token on the other network
node scripts/eth-pol-bridge.js

T6 - testing script for executing token sending
node scripts/send-tokens.js
```

![](https://api.ipfsbrowser.com/ipfs/get.php?hash=QmQ77CPxuxSjErYMgyyZt76D8cKN1pLrmkCdf6r5cgEmkr)
