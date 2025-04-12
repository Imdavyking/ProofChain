import { Request, Response } from "express";
import dotenv from "dotenv";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import multer from "multer";
import path from "path";
import logger from "../config/logger";
import { ethers } from "ethers";
import { environment } from "../utils/config";
import { uploadToPinata } from "../services/pinata.services";
import io from "../utils/create.websocket";
import { mintCapacityNFT } from "../services/mint.lit.services";
dotenv.config();

export const getSessionSigs = async (req: Request, res: Response) => {
  try {
    const dataSetABI = new ethers.Interface([
      "function canAccess(uint256 datasetId, address user) external view returns (bool)",
    ]);
    const { signature, message: datasetId } = req.body;
    const messageHash = ethers.solidityPackedKeccak256(
      ["uint256"],
      [datasetId]
    );

    const ethSignedMessageHash = ethers.hashMessage(
      ethers.getBytes(messageHash)
    );
    const userAddress = ethers.recoverAddress(ethSignedMessageHash, signature);

    const dataSetContract = new ethers.Contract(
      environment.DATASET_CONTRACT_ADDRESS,
      dataSetABI
    );

    const canAccess = await dataSetContract.canAccess(datasetId, userAddress);

    if (!canAccess) {
      res.status(403).json({
        error: "User does not have access to this dataset",
      });
      return;
    }
    if (canAccess) {
      const sessionSigs = await mintCapacityNFT();
      res.status(200).json({
        message: "User has access to this dataset",
        sessionSigs,
      });
    }
  } catch (error) {
    logger.error("Error getting session signatures:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
