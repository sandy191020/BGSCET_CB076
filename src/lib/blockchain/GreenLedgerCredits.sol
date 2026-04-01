// Simplified ERC-1155 contract for GreenLedger Carbon Credits
// Target: Polygon Amoy Testnet

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract GreenLedgerCredits is ERC1155, Ownable, ERC1155Supply {
    mapping(uint256 => string) private _tokenUris;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(address account, uint256 id, uint256 amount, string memory tokenUri, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
        _tokenUris[id] = tokenUri;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return _tokenUris[id];
    }

    // Additional functions for the secondary marketplace can be added here
}
