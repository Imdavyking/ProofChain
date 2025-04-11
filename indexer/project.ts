import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

import * as dotenv from "dotenv";
import { cleanDB } from "./src/utils/clean";

cleanDB();

dotenv.config();

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "creator-testnet-starter",
  description:
    "This project can be use as a starting point for developing your new Creator Testnet SubQuery project",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for Creator Testnet this is 66665
     * https://chainlist.org/chain/66665
     */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.RPC_URL!?.split(",") as string[] | string,
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: +process.env.BLOCK_NUMBER!,
      options: {
        abi: "Abi",
        address: process.env.CONTRACT_ADDRESS!,
      },
      assets: new Map([["Abi", { file: "./abis/abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleDatasetCreatedLog",
            
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "DatasetCreated(uint256,address,string,uint256,uint256)",
              ],
            },
          },
          {
            handler: "handleDatasetUpdatedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: ["DatasetUpdated(uint256,string,uint256)"],
            },
          },
          {
            handler: "handleDatasetPurchasedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: ["DatasetPurchased(uint256,address)"],
            },
          },
          {
            handler: "handleDatasetRatedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: ["DatasetRated(uint256,address,uint8)"],
            },
          },
          {
            handler: "handleDatasetDownloadedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: ["DatasetDownloaded(uint256,address)"],
            },
          },
        ],
      },
    },
  ],
  repository: "https://github.com/Imdavyking/ProofChain",
};

// Must set default to the project instance
export default project;
