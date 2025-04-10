// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DatasetMarketplace is ReentrancyGuard {
    struct Dataset {
        address owner;
        string cid;
        uint256 price;
        uint256 starsTotal;
        uint256 starsCount;
        uint256 downloads;
    }

    uint256 public datasetCounter;
    mapping(uint256 => Dataset) public datasets;

    // datasetId => buyer => hasAccess
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    // datasetId => user => hasRated
    mapping(uint256 => mapping(address => bool)) public hasRated;

    // datasetId => reviewId => review text
    mapping(uint256 => mapping(uint256 => string)) public reviews;

    event DatasetCreated(
        uint256 indexed id,
        address indexed owner,
        string cid,
        uint256 price
    );
    event DatasetUpdated(uint256 indexed id, string newCid, uint256 newPrice);
    event DatasetPurchased(uint256 indexed id, address indexed buyer);
    event DatasetRated(uint256 indexed id, address indexed rater, uint8 stars);
    event DatasetDownloaded(uint256 indexed id, address indexed user);

    error DatasetMarketplace__NotDatasetOwner();
    error DatasetMarketplace__InsufficientPayment();
    error DatasetMarketplace__AccessDenied();
    error DatasetMarketplace__DatasetNotFound();
    error DatasetMarketplace__InvalidDatasetId();
    error DatasetMarketplace__AlreadyHasAccess();
    error DatasetMarketplace__AlreadyRated();
    error DatasetMarketplace__InvalidStarValue();
    error DatasetMarketplace__PaymentFailed();

    function uploadDataset(string calldata cid, uint256 price) external {
        datasets[datasetCounter] = Dataset({
            owner: msg.sender,
            cid: cid,
            price: price,
            starsTotal: 0,
            starsCount: 0,
            downloads: 0
        });

        emit DatasetCreated(datasetCounter, msg.sender, cid, price);
        datasetCounter++;
    }

    function updateDataset(
        uint256 datasetId,
        string calldata newCid,
        uint256 newPrice
    ) external {
        if (datasetId >= datasetCounter)
            revert DatasetMarketplace__InvalidDatasetId();

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

    function purchaseAccess(uint256 datasetId) external payable nonReentrant {
        if (datasetId >= datasetCounter)
            revert DatasetMarketplace__DatasetNotFound();

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
        uint256 datasetId,
        address user
    ) external view returns (bool) {
        return hasAccess[datasetId][user];
    }

    function getDataset(
        uint256 datasetId
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
    function rateDataset(uint256 datasetId, uint8 stars) external {
        if (datasetId >= datasetCounter)
            revert DatasetMarketplace__DatasetNotFound();
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
    function recordDownload(uint256 datasetId) external {
        if (!hasAccess[datasetId][msg.sender])
            revert DatasetMarketplace__AccessDenied();

        Dataset storage dataset = datasets[datasetId];
        dataset.downloads += 1;

        emit DatasetDownloaded(datasetId, msg.sender);
    }
}
