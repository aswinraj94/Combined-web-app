// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT_Marketplace is ERC721Enumerable{
  using Counters for Counters.Counter;
  Counters.Counter private _nftCount;
  uint256 public _Mintingprice = 0.00001 ether;
  uint256 public tokenIds;
	address private _owner;
  mapping(uint256 => NFT) private _idToNFT;
  mapping(address => uint256) public votingPower;
  struct NFT {
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool listed;
  }

    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }



  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){
		_owner = payable (msg.sender);
    tokenIds=0;
  }

  function Transfer_NFT(address from, address to,uint256 tokenId) external {
    transferFrom(from,to,tokenId);
    votingPower[to] ++;
    votingPower[from] --;
  }

  function mint() public payable  {
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
        votingPower[msg.sender]++;
    }

  

  function getMyNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }







}