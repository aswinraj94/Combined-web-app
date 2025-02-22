// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./IToken_Factory.sol";



contract One_to_one_Voting {

    struct Proposal {
	    bytes32 title;
        uint proposal_id;
        uint voteCountPos;
        uint voteCountNeg;
        uint voteCountAbs;
		string description;
        mapping (address => Voter) voters;
        address[] votersAddress;
    }

    struct Voter {
        uint value;
        bool voted;
    }

    uint private voteValue;
	
    IMembership_Abstraction Membership_Abstraction;

	mapping(uint => Proposal) public proposals; 
	uint public ProposalCount = 0; 

    event CreatedProposalEvent(uint proposal_id);
    event CreatedVoteEvent();
	
	
    constructor (address Membership_Abstraction_contract, uint _voteValue) {
		Membership_Abstraction = IMembership_Abstraction(Membership_Abstraction_contract);
		voteValue=_voteValue;
    }

    function getProposal(uint proposal_id) public view returns (uint, uint, uint, address[] memory) {
        Proposal storage proposal = proposals[proposal_id]; 
        return ( proposal.voteCountPos, proposal.voteCountNeg, proposal.voteCountAbs, proposal.votersAddress);
    }

    function addProposal(bytes32 title, string memory description) public returns (bool) {
		ProposalCount++;
		Proposal storage proposal = proposals[ProposalCount];
        proposal.proposal_id = ProposalCount;
		proposal.title = title;
		proposal.description = description;
		emit CreatedProposalEvent(ProposalCount);
        return true;
    }
	
	function Get_Voting_Power()public view returns(uint256){
	return(Membership_Abstraction.votingPower(msg.sender));
	}

    function vote(uint proposal_id, uint8 positive_Vote) public returns (bool) {
		require(Membership_Abstraction.votingPower(msg.sender)>= voteValue,"Not Enough Balance to Vote");
        Proposal storage proposal = proposals[proposal_id]; // Get the proposal
        proposal.votersAddress.push(msg.sender);
		if (positive_Vote == 1) {
		proposal.voteCountPos ++;
		}
		else if (positive_Vote == 2){
		proposal.voteCountNeg ++;
		}
		else if (positive_Vote == 0){
		proposal.voteCountAbs ++;
		}
        emit CreatedVoteEvent();
        return true;

    }

}
