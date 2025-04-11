import DatasetMarketplaceDeployer from "../ignition/modules/DatasetMarketplace";
import hre, { network } from "hardhat";
import { verify } from "./verify.deploy";
import { cleanDeployments } from "../utils/clean";

async function main() {
  const chainId = network.config.chainId!;

  cleanDeployments(chainId!);
  const { datasetMarketplace } = await hre.ignition.deploy(
    DatasetMarketplaceDeployer
  );
  await datasetMarketplace.waitForDeployment();
  const datasetMarketplaceAddress = await datasetMarketplace.getAddress();
  console.log(
    `DatasetMarketplace deployed to ${datasetMarketplaceAddress} on ${hre.network.name}`
  );
  await verify(datasetMarketplaceAddress, []);
}

main().catch(console.error);
