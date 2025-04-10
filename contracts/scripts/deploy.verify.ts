import DatasetMarketplaceDeployer from "../ignition/modules/DatasetMarketplace";
import hre from "hardhat";
import { verify } from "./verify.deploy";

async function main() {
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
