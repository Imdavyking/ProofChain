// ignition/modules/DatasetMarketplaceModule.ts

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DatasetMarketplaceModule = buildModule(
  "DatasetMarketplaceModule",
  (m) => {
    const datasetMarketplace = m.contract("DatasetMarketplace");

    return { datasetMarketplace };
  }
);

export default DatasetMarketplaceModule;
