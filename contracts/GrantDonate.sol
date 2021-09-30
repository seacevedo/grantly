// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./GrantToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract GrantDonate is Ownable {

    using Counters for Counters.Counter;

    event Donation(uint256 grantId, uint256 amount);
    
    GrantToken private grantToken;
    
    mapping(address => uint256) public donations;
    mapping(uint256 => uint256) public totalGrantFunds;
    uint256 public totalAmountDonated = 0;
    

    constructor(GrantToken _grantToken) {
        grantToken = _grantToken;
    }
    
    function donate(uint256 _grantId) external payable {
        require(msg.value > 0, "Amount must greater then zero.");
        address ownerAddress = grantToken.ownerOf(_grantId);
        payable(ownerAddress).transfer(msg.value);
        donations[ownerAddress] += msg.value;
        totalGrantFunds[_grantId] += msg.value;
        totalAmountDonated += msg.value;
        emit Donation(_grantId, msg.value);
    }
    

}