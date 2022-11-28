// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IMembership_Abstraction {
  function votingPower(address) external view returns(uint256);
  
  function approve(address spender, uint amount) external returns (bool);
  
  function transferFrom(address sender,address recipient,uint amount) external returns (bool);
  
  function transfer(address recipient, uint amount) external returns (bool);

}
