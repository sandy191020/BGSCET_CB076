// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GreenLedger is ERC1155, Ownable {
    using Strings for uint256;

    struct FarmData {
        string satelliteHash;
        uint256 creditScore;
        address farmer;
        uint256 totalCredits;
        bool verified;
    }

    struct Listing {
        uint256 farmId;
        address seller;
        uint256 amount;
        uint256 pricePerToken;
        bool active;
    }

    mapping(uint256 => FarmData) public farms;
    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    uint256 public nextFarmId;

    string private baseMetadataURI;

    event CreditsMinted(
        address indexed farmer,
        uint256 indexed farmId,
        uint256 amount,
        string satelliteHash,
        uint256 creditScore
    );

    event CreditsListed(
        uint256 indexed listingId,
        uint256 indexed farmId,
        address indexed seller,
        uint256 amount,
        uint256 pricePerToken
    );

    event CreditsPurchased(
        uint256 indexed listingId,
        uint256 indexed farmId,
        address indexed buyer,
        address seller,
        uint256 amount,
        uint256 totalPrice
    );

    constructor(string memory _baseMetadataURI) ERC1155(_baseMetadataURI) Ownable(msg.sender) {
        baseMetadataURI = _baseMetadataURI;
        nextFarmId = 1;
        nextListingId = 1;
    }

    function mintCredits(
        address farmer,
        uint256 farmId,
        uint256 amount,
        string calldata satelliteHash,
        uint256 creditScore
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(creditScore <= 100, "Credit score must be <= 100");

        if (farms[farmId].farmer == address(0)) {
            farms[farmId] = FarmData({
                satelliteHash: satelliteHash,
                creditScore: creditScore,
                farmer: farmer,
                totalCredits: amount,
                verified: true
            });
        } else {
            require(farms[farmId].farmer == farmer, "Farm belongs to different farmer");
            farms[farmId].satelliteHash = satelliteHash;
            farms[farmId].creditScore = creditScore;
            farms[farmId].totalCredits += amount;
        }

        _mint(farmer, farmId, amount, "");

        emit CreditsMinted(farmer, farmId, amount, satelliteHash, creditScore);
    }

    function listForSale(
        uint256 farmId,
        uint256 amount,
        uint256 pricePerToken
    ) external {
        require(balanceOf(msg.sender, farmId) >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerToken > 0, "Price must be greater than 0");

        uint256 listingId = nextListingId++;

        listings[listingId] = Listing({
            farmId: farmId,
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });

        emit CreditsListed(listingId, farmId, msg.sender, amount, pricePerToken);
    }

    function buyCredits(uint256 listingId, uint256 amount) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(amount > 0 && amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = amount * listing.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");

        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
        }

        safeTransferFrom(listing.seller, msg.sender, listing.farmId, amount, "");

        payable(listing.seller).transfer(totalPrice);

        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit CreditsPurchased(
            listingId,
            listing.farmId,
            msg.sender,
            listing.seller,
            amount,
            totalPrice
        );
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.active = false;
    }

    function getFarmData(uint256 farmId) external view returns (FarmData memory) {
        return farms[farmId];
    }

    function getActiveListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseMetadataURI, tokenId.toString(), ".json"));
    }

    function setBaseMetadataURI(string memory _baseMetadataURI) external onlyOwner {
        baseMetadataURI = _baseMetadataURI;
    }
}
