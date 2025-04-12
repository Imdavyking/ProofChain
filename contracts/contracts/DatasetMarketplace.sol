// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DatasetMarketplace is ReentrancyGuard {
    enum DatasetCategory {
        Finance,
        Medicine,
        Text
    }
    struct Dataset {
        address owner;
        string cid;
        uint256 price;
        uint256 starsTotal;
        uint256 starsCount;
        uint256 downloads;
        uint256 createdAt;
        DatasetCategory category;
        string title;
        string preview;
        string id;
    }

    mapping(string => Dataset) public datasets;
    Dataset[] public datasetsArray;

    // datasetId => buyer => hasAccess
    mapping(string => mapping(address => bool)) public hasAccess;

    // datasetId => user => hasRated
    mapping(string => mapping(address => bool)) public hasRated;

    // datasetId => reviewId => review text
    mapping(string => mapping(uint256 => string)) public reviews;

    event DatasetCreated(
        string indexed id,
        address indexed owner,
        string cid,
        uint256 createdAt,
        uint256 price
    );
    event DatasetUpdated(string indexed id, string newCid, uint256 newPrice);
    event DatasetPurchased(string indexed id, address indexed buyer);
    event DatasetRated(string indexed id, address indexed rater, uint8 stars);
    event DatasetDownloaded(string indexed id, address indexed user);

    error DatasetMarketplace__NotDatasetOwner();
    error DatasetMarketplace__InsufficientPayment();
    error DatasetMarketplace__AccessDenied();
    error DatasetMarketplace__DatasetNotFound();
    error DatasetMarketplace__InvalidDatasetId();
    error DatasetMarketplace__AlreadyHasAccess();
    error DatasetMarketplace__AlreadyRated();
    error DatasetMarketplace__InvalidStarValue();
    error DatasetMarketplace__PaymentFailed();

    function uploadDataset(
        string calldata datasetId,
        string calldata cid,
        uint256 price,
        DatasetCategory category,
        string calldata preview,
        string calldata title
    ) external {
        Dataset memory dataset = Dataset({
            owner: msg.sender,
            cid: cid,
            price: price,
            starsTotal: 0,
            starsCount: 0,
            createdAt: block.timestamp,
            downloads: 0,
            category: category,
            title: title,
            preview: preview,
            id: datasetId
        });
        datasetsArray.push(dataset);
        datasets[datasetId] = dataset;

        emit DatasetCreated(datasetId, msg.sender, cid, block.timestamp, price);
    }

    function updateDataset(
        string calldata datasetId,
        string calldata newCid,
        uint256 newPrice
    ) external {
        Dataset storage dataset = datasets[datasetId];
        if (dataset.owner != msg.sender)
            revert DatasetMarketplace__NotDatasetOwner();
        if (newPrice == 0) revert DatasetMarketplace__InsufficientPayment();
        if (bytes(newCid).length == 0)
            revert DatasetMarketplace__AccessDenied();

        dataset.cid = newCid;
        dataset.price = newPrice;

        emit DatasetUpdated(datasetId, newCid, newPrice);
    }

    function purchaseAccess(
        string calldata datasetId
    ) external payable nonReentrant {
        Dataset memory dataset = datasets[datasetId];
        if (msg.value < dataset.price)
            revert DatasetMarketplace__InsufficientPayment();
        if (hasAccess[datasetId][msg.sender])
            revert DatasetMarketplace__AlreadyHasAccess();

        hasAccess[datasetId][msg.sender] = true;

        (bool success, ) = dataset.owner.call{value: msg.value}("");

        if (!success) {
            revert DatasetMarketplace__PaymentFailed();
        }

        emit DatasetPurchased(datasetId, msg.sender);
    }

    function canAccess(
        string calldata datasetId,
        address user
    ) external view returns (bool) {
        return hasAccess[datasetId][user];
    }

    function getAllDatasets()
        external
        view
        returns (Dataset[] memory allDatasets)
    {
        return datasetsArray;
    }

    function getDataset(
        string calldata datasetId
    )
        external
        view
        returns (
            string memory cid,
            uint256 price,
            address owner,
            uint256 stars,
            uint256 count,
            uint256 downloads
        )
    {
        Dataset memory dataset = datasets[datasetId];
        return (
            dataset.cid,
            dataset.price,
            dataset.owner,
            dataset.starsTotal,
            dataset.starsCount,
            dataset.downloads
        );
    }

    /// ⭐ Users can rate a dataset (once)
    function rateDataset(string calldata datasetId, uint8 stars) external {
        if (stars < 1 || stars > 5)
            revert DatasetMarketplace__InvalidStarValue();
        if (hasRated[datasetId][msg.sender])
            revert DatasetMarketplace__AlreadyRated();

        Dataset storage dataset = datasets[datasetId];
        dataset.starsTotal += stars;
        dataset.starsCount += 1;
        hasRated[datasetId][msg.sender] = true;

        emit DatasetRated(datasetId, msg.sender, stars);
    }

    /// ⬇️ Increase download count
    function recordDownload(string calldata datasetId) external {
        if (!hasAccess[datasetId][msg.sender])
            revert DatasetMarketplace__AccessDenied();

        Dataset storage dataset = datasets[datasetId];
        dataset.downloads += 1;

        emit DatasetDownloaded(datasetId, msg.sender);
    }
}
