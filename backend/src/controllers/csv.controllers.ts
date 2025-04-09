import { Request, Response } from "express";
import dotenv from "dotenv";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
dotenv.config();

/**
 * Handles CSV file upload and processing.
 * @param {Request} req - The request object containing the uploaded CSV file.
 * @param {Response} res - The response object to send the result.
 * @route POST /api/upload-csv
 */
export const processCSVUpload = async (req: Request, res: Response) => {
  try {
    const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
      alertWhenUnauthorized: false,
      litNetwork: LIT_NETWORK.Datil,
    });

    await litNodeClient.connect();

    const accessControlConditions = [
      {
        contractAddress: "0xYourContract",
        chain: "filecoin",
        functionName: "canAccess",
        functionParams: ["<DATASET_ID>", ":userAddress"],
        functionAbi: {
          inputs: [
            { internalType: "uint256", name: "datasetId", type: "uint256" },
            { internalType: "address", name: "user", type: "address" },
          ],
          name: "canAccess",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
        returnValueTest: {
          comparator: "=",
          value: "true",
        },
      },
    ];
    // const { ciphertext, dataToEncryptHash } = await litNodeClient.encrypt({
    //   accessControlConditions,
    //   dataToEncrypt: message,
    // });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
