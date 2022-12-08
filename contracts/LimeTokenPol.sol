// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "./IToken.sol";

contract LimeTokenPol is IToken, Ownable, ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
  }

  function mint(address to, uint amount) external override onlyOwner {
    _mint(to, amount);
  }

  function burn(address owner, uint amount) external override onlyOwner {
    _burn(owner, amount);
  }
}