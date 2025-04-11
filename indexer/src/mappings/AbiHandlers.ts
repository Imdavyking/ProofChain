import assert from "assert";
import {
  DatasetCreatedLog,
  DatasetUpdatedLog,
  DatasetPurchasedLog,
  DatasetRatedLog,
  DatasetDownloadedLog,
} from "../types/abi-interfaces/Abi";
import {
  Dataset,
  DatasetUpdate,
  DatasetPurchase,
  DatasetRating,
  DatasetDownload,
} from "../types";

export async function handleDatasetCreatedLog(
  log: DatasetCreatedLog
): Promise<void> {
  logger.info(`New DatasetCreated at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const dataset = Dataset.create({
    id: log.args.id.toString(),
    owner: log.args.owner,
    cid: log.args.cid,
    createdAt: log.args.createdAt.toBigInt(),
    updatedAt: log.args.createdAt.toBigInt(),
    price: log.args.price.toBigInt(),
  });
  await dataset.save();
}

export async function handleDatasetUpdatedLog(
  log: DatasetUpdatedLog
): Promise<void> {
  logger.info(`New DatasetUpdated at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const dataset = await Dataset.get(log.args.id.toString());
  if (!dataset) {
    logger.error("Dataset not found");
    return;
  }

  dataset.cid = log.args.newCid;
  dataset.price = log.args.newPrice.toBigInt();
  dataset.updatedAt = log.block.timestamp;

  await dataset.save();

  const update = DatasetUpdate.create({
    id: `${log.args.id.toString()}-${log.blockNumber}`,
    datasetId: log.args.id.toBigInt(),
    newCid: log.args.newCid,
    newPrice: log.args.newPrice.toBigInt(),
    blockHeight: BigInt(log.blockNumber),
    contractAddress: log.address,
  });
  await update.save();
}

export async function handleDatasetPurchasedLog(
  log: DatasetPurchasedLog
): Promise<void> {
  logger.info(`New DatasetPurchased at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const purchase = DatasetPurchase.create({
    id: log.transactionHash,
    datasetId: log.args.id.toString(),
    buyer: log.args.buyer,
    blockHeight: BigInt(log.blockNumber),
    contractAddress: log.address,
  });
  await purchase.save();
}

export async function handleDatasetRatedLog(
  log: DatasetRatedLog
): Promise<void> {
  logger.info(`New DatasetRated at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const rating = DatasetRating.create({
    id: log.transactionHash,
    datasetId: log.args.id.toString(),
    rater: log.args.rater,
    stars: log.args.stars,
    blockHeight: BigInt(log.blockNumber),
    contractAddress: log.address,
  });
  await rating.save();
}

export async function handleDatasetDownloadedLog(
  log: DatasetDownloadedLog
): Promise<void> {
  logger.info(`New DatasetDownloaded at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const download = DatasetDownload.create({
    id: log.transactionHash,
    datasetId: log.args.id.toString(),
    user: log.args.user,
    blockHeight: BigInt(log.blockNumber),
    contractAddress: log.address,
  });
  await download.save();
}
