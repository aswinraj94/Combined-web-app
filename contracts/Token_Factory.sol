// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token_Factory is IERC20{
    uint256 public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
	
	mapping(address => uint256) public votingPower;

	string public name ;
    string public symbol;
    uint8 public decimals ;
	bool public Intialized = false ;
	address private _owner;

	
	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	modifier ToIntialize(){
	require(Intialized == false);
	 _;
	}
	
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }
	
    //function intializer( //external ToIntialize{
        constructor(
	    uint256 _totalSupply,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol) {
        
		
        symbol = _tokenSymbol;
        name = _tokenName;
        decimals = _decimalUnits;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
		votingPower[msg.sender] = _totalSupply;
		Intialized = true;
		_owner = msg.sender;
        emit Transfer(address(0), msg.sender, _totalSupply);
		emit OwnershipTransferred(address(0), _owner);
    }	
	


    function transfer(address recipient, uint amount) external returns (bool) {
		require(balanceOf[msg.sender]>=amount,"Not enough Balance");
		// Members_Data[recipient].IsaMember = true;
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        votingPower[msg.sender] -= amount;
        votingPower[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address spender,
        address recipient,
        uint amount
    ) external returns (bool) {
		require(balanceOf[spender]>=amount,"Not enough Balance");
		// Members_Data[recipient].IsaMember = true;
        //allowance[recipient][spender] -= amount;
        balanceOf[spender] -= amount;
        balanceOf[recipient] += amount;
        votingPower[spender] -= amount;
        votingPower[recipient] += amount;
        emit Transfer(spender, recipient, amount);
        return true;
    }

    function mint(uint amount) external onlyOwner{
        balanceOf[msg.sender] += amount;
		votingPower[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external onlyOwner{
        balanceOf[msg.sender] -= amount;
		votingPower[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}