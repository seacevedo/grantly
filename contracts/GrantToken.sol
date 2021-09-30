// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GrantToken is ERC721Enumerable, Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    event GrantCreated(uint256 grantId);
    mapping(uint256 => string) grantURI;
    
    

    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {

    }

    function mintToken(address _owner, string memory _metadataURI) external returns (uint256){
        uint256 newGrantId = _tokenIds.current();
        _safeMint(_owner, newGrantId);
        grantURI[newGrantId] = _metadataURI;
        _tokenIds.increment();
        emit GrantCreated(newGrantId);
        return newGrantId;

    }
    

    function tokenURI(uint256 _grantId) public view override returns (string memory) {
       require(_exists(_grantId), "ERC721Metadata: Query for nonexistent token");
       return grantURI[_grantId];
    }


}