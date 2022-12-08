// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import "./IToken.sol";

contract BridgeBase is Ownable {

  constructor(address _token) {
    token = IToken(_token);
  }

  IToken public token;
  uint public nonce;
  mapping(uint => bool) public processedNonces;

  enum Step { Burn, Mint }
  event Transfer(
    address from,
    address to,
    uint amount,
    uint date,
    uint nonce,
    Step indexed step
  );

  function burn(address to, uint amount) external {
    token.burn(msg.sender, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      Step.Burn
    );
    nonce++;
  }

  function mint(address to, uint amount, uint otherChainNonce) external onlyOwner {
    require(!processedNonces[otherChainNonce], "transfer already processed");
    processedNonces[otherChainNonce] = true;
    token.mint(to, amount);
    
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      otherChainNonce,
      Step.Mint
    );
  }
}