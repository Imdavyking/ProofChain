// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DatasetMarketplace {
    struct Dataset {
        address owner;
        string cid; // IPFS CID
        uint256 price; // in wei
    }

    uint256 public datasetCounter;
    mapping(uint256 => Dataset) public datasets;

    // datasetId => buyer => hasAccess
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    event DatasetCreated(
        uint256 indexed id,
        address indexed owner,
        string cid,
        uint256 price
    );
    event DatasetUpdated(uint256 indexed id, string newCid, uint256 newPrice);
    event DatasetPurchased(uint256 indexed id, address indexed buyer);

    /// errors
    error DatasetMarketplace__NotDatasetOwner();
    error DatasetMarketplace__InsufficientPayment();
    error DatasetMarketplace__AccessDenied();
    error DatasetMarketplace__DatasetNotFound();
    error DatasetMarketplace__InvalidDatasetId();
    error DatasetMarketplace__AlreadyHasAccess();

    /// @dev Upload a new dataset
    function uploadDataset(string calldata cid, uint256 price) external {
        datasets[datasetCounter] = Dataset({
            owner: msg.sender,
            cid: cid,
            price: price
        });

        emit DatasetCreated(datasetCounter, msg.sender, cid, price);
        datasetCounter++;
    }

    /// @dev Update dataset info (only by uploader)
    function updateDataset(
        uint256 datasetId,
        string calldata newCid,
        uint256 newPrice
    ) external {
        Dataset storage dataset = datasets[datasetId];
        if (dataset.owner != msg.sender) {
            revert DatasetMarketplace__NotDatasetOwner();
        }

        if (datasetId >= datasetCounter) {
            revert DatasetMarketplace__InvalidDatasetId();
        }
        if (newPrice == 0) {
            revert DatasetMarketplace__InsufficientPayment();
        }
        if (bytes(newCid).length == 0) {
            revert DatasetMarketplace__AccessDenied();
        }

        dataset.cid = newCid;
        dataset.price = newPrice;

        emit DatasetUpdated(datasetId, newCid, newPrice);
    }

    /// @dev Purchase access to dataset
    function purchaseAccess(uint256 datasetId) external payable {
        Dataset memory dataset = datasets[datasetId];
        if (datasetId >= datasetCounter) {
            revert DatasetMarketplace__DatasetNotFound();
        }

        if (msg.value < dataset.price) {
            revert DatasetMarketplace__InsufficientPayment();
        }

        if (hasAccess[datasetId][msg.sender]) {
            revert DatasetMarketplace__AlreadyHasAccess();
        }

        hasAccess[datasetId][msg.sender] = true;

        // Transfer funds to the dataset provider
        (bool success, ) = dataset.owner.call{value: msg.value}("");

        emit DatasetPurchased(datasetId, msg.sender);
    }

    /// @dev Check access (Lit Protocol will call this off-chain or via Lit Action)
    function canAccess(
        uint256 datasetId,
        address user
    ) external view returns (bool) {
        return hasAccess[datasetId][user];
    }

    /// @dev Helper to get dataset details
    function getDataset(
        uint256 datasetId
    ) external view returns (string memory cid, uint256 price, address owner) {
        Dataset memory dataset = datasets[datasetId];
        return (dataset.cid, dataset.price, dataset.owner);
    }
}
