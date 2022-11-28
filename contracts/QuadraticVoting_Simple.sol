// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "./IToken_Factory.sol";

contract QuadraticVoting_Simple{


  struct Item {
    address payable owner;
    uint amount;
    bytes32 title;
    string imageHash; // IPFS cid
    string description;
    mapping(address => uint) positiveVotes; // user => weight
    mapping(address => uint) negativeVotes; // user => weight
    uint totalPositiveWeight;
    uint totalNegativeWeight;
  }
  
  IMembership_Abstraction Membership_Abstraction;
  
  uint256 public voteCost; 

  mapping(uint => Item) public items; // itemId => id
  uint public itemCount = 0; // also next itemId
  
  event ItemCreated(uint itemId);
  event Voted(uint itemId, uint weight, bool positive);
  
  
  constructor (address Membership_Abstraction_contract,uint256 CostofVote) {
    Membership_Abstraction = IMembership_Abstraction(Membership_Abstraction_contract);
	voteCost=CostofVote;
  }
  
  //Membership_Abstraction.votingPower(msg.sender)

  function currentWeight(uint itemId, address addr, bool isPositive) public view returns(uint) {
    if (isPositive) {
      return items[itemId].positiveVotes[addr];
    } else {
      return items[itemId].negativeVotes[addr];
    }
  }

  function calcCost(uint currWeight, uint weight) public view returns(uint) {
    if (currWeight > weight) {
      return weight * weight * voteCost; // cost is always quadratic
    } else if (currWeight < weight) {
      // this allows users to save on costs if they are increasing their vote
      // example: current weight is 3, they want to change it to 5
      // this would cost 16x (5 * 5 - 3 * 3) instead of 25x the vote cost
      return (weight * weight - currWeight * currWeight) * voteCost;
    } else {
      return 0;
    }
  }

  function createItem(bytes32 title, string memory imageHash, string memory description) public {
    uint itemId = itemCount++;
    Item storage item = items[itemId];
    item.owner = payable(msg.sender);
    item.title = title;
    item.imageHash = imageHash;
    item.description = description;
    emit ItemCreated(itemId);
  }
  
  function positiveVote(uint itemId, uint weight) public payable {
    //uint256 VotingPower_;
    Item storage item = items[itemId];
    require(msg.sender != item.owner,"Item Owner cannot Vote"); // owners cannot vote on their own items
	
    uint currWeight = item.positiveVotes[msg.sender];
    if (currWeight == weight) {
      return; // no need to process further if vote has not changed
    }

    uint cost = calcCost(currWeight, weight);
    require(Membership_Abstraction.votingPower(msg.sender) >= cost,"Not Enough Balance to Vote"); // msg.value must be enough to cover the cost

    item.positiveVotes[msg.sender] = weight;
    item.totalPositiveWeight += weight - currWeight;
	
	//Decrease the voting power of the user
	//VotingPower_=Membership_Abstraction.votingPower(msg.sender);
	//VotingPower_-= cost;

	Membership_Abstraction.transferFrom(msg.sender,item.owner,cost);

    // weight cannot be both positive and negative simultaneously
    item.totalNegativeWeight -= item.negativeVotes[msg.sender];
    item.negativeVotes[msg.sender] = 0;

    //item.amount += msg.value; // reward creator of item for their contribution

    emit Voted(itemId, weight, true);
  }
  
  function negativeVote(uint itemId, uint weight) public payable {
    //uint256 VotingPower_;
    Item storage item = items[itemId];
    require(msg.sender != item.owner,"Item Owner cannot Vote");

    uint currWeight = item.negativeVotes[msg.sender];
    if (currWeight == weight) {
      return; // no need to process further if vote has not changed
    }

    uint cost = calcCost(currWeight, weight);
    require(Membership_Abstraction.votingPower(msg.sender)>= cost,"Not Enough Balance to Vote"); // msg.value must be enough to cover the cost

    item.negativeVotes[msg.sender] = weight;
    item.totalNegativeWeight += weight - currWeight;
	
	//Decrease the voting power of the user
	//VotingPower_=Membership_Abstraction.votingPower(msg.sender);
	//VotingPower_-= cost;
	
	Membership_Abstraction.transferFrom(msg.sender,item.owner,cost);

    // weight cannot be both positive and negative simultaneously
    item.totalPositiveWeight -= item.positiveVotes[msg.sender];
    item.positiveVotes[msg.sender] = 0;

    // distribute voting cost to every item except for this one
    // uint reward = msg.value / (itemCount - 1);
    // for (uint i = 0; i < itemCount; i++) {
      // if (i != itemId) items[i].amount += reward;
    // }

    emit Voted(itemId, weight, false);
  }
  
  function claim(uint itemId) public {
    Item storage item = items[itemId];
    require(msg.sender == item.owner,"Not the Item Owner");
    item.owner.transfer(item.amount);
    item.amount = 0;
  }
}