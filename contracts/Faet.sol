// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";

contract Faet is ERC721AQueryable, Ownable {
    
    // Mapping to store the IPFS CIDs for each token
    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner) ERC721A("Faet", "FAET") Ownable(initialOwner) {
    }

    // Batch minting function that allows the owner to mint multiple assets, each with its own unique URI
    function mintNFT(
        address to,
        uint256 quantity,
        string[] memory ipfsCIDs
    ) public onlyOwner {
        require(to != address(0), "Faet: cannot mint to the zero address");
        require(quantity > 0, "Faet: quantity must be greater than zero");
        require(quantity == ipfsCIDs.length, "Faet: IPFS CIDs length mismatch with quantity");

        // Fetch the starting token ID for this minting batch
        uint256 startTokenId = _nextTokenId();

        // Perform batch minting
        _mint(to, quantity);

        // Assign unique IPFS CIDs to each minted token
        for (uint256 i = 0; i < quantity; i++) {
            uint256 newTokenId = startTokenId + i;
            _tokenURIs[newTokenId] = ipfsCIDs[i];
        }
    }

    // Function to get data for a given token ID
    function getTokenData(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Faet: Data query for nonexistent token");

        string memory ipfsCID = _tokenURIs[tokenId];
        return ipfsCID;
    }

    // Override tokenURI to return the IPFS CID
    function tokenURI(uint256 tokenId) public view virtual override(ERC721A, IERC721A) returns (string memory) {
        require(_exists(tokenId), "Faet: URI query for nonexistent token");

        string memory ipfsCID = _tokenURIs[tokenId];
        return bytes(ipfsCID).length > 0 ? string(abi.encodePacked("ipfs://", ipfsCID)) : "";
    }
}
