import { ellipsify } from "../../utils/ellipsify";
import React, { useEffect, useState } from "react";
import CSVPreview from "../csv-preview/main";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import {
  canAccess,
  purchaseAccess,
  rethrowFailedResponse,
} from "../../services/blockchain.services.ts";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "../../services/axios.config.services.ts";
import axiosRequest from "axios";
import { signDataSetId } from "../../services/dataset.signature.services.ts";
import {
  DATASET_CONTRACT_ADDRESS,
  LIT_PROTOCOL_IDENTIFIER,
} from "../../utils/constants.js";
const DatasetItem = ({ dataset }) => {
  const [canAccessDataset, setCanAccessDataset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canAccessCall = async () => {
    const userCanDownload = await canAccess(dataset.id);
    setCanAccessDataset(userCanDownload);
  };

  const modelTypes = ["LinearRegression", "RandomForest", "DecisionTree"];

  const trainAndPredict = async ({ targetColumn, modelType }) => {
    try {
      const pinataUrl = `https://emerald-odd-bee-965.mypinata.cloud/ipfs/${dataset.cid}`;
      const fetchResult = await axiosRequest.get(pinataUrl);
      const { ciphertext, dataToEncryptHash, evmContractConditions } =
        fetchResult.data;

      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: LIT_NETWORK.DatilTest,
        debug: false,
      });
      await litNodeClient.connect();
      const message = dataset.id;
      const signature = await signDataSetId(message);
      const sessionResponse = await axios.post("/api/lit-session", {
        signature,
        message,
        evmContractConditions,
        chain: LIT_PROTOCOL_IDENTIFIER,
        ciphertext,
        dataToEncryptHash,
      });
      const { decryptedString: csv_data } = sessionResponse.data;
      const responseTraining = await axiosRequest.post(
        "http://127.0.0.1:5000/train",
        {
          dataset_id: dataset.id,
          model_type: modelType,
          target_column: targetColumn,
          csv_data,
        }
      );
    } catch (error) {}
  };
  // add train and predict button and also UI
  //  // csv_data = data.get('csv_data')
  //     // model_type = data.get('model_type')
  //     // target_column = data.get('target_column')
  //     // dataset_id = data.get('dataset_id')

  //
  // dataset_id = data.get('dataset_id')
  // input_data = data.get('input_data')
  //     axiosRequest.post("http://127.0.0.1:5000/predict",{
  //       datasetId: dataset.id,
  //     });

  const downloadDataset = async () => {
    try {
      setIsLoading(true);

      const response = "";
      const pinataUrl = `https://emerald-odd-bee-965.mypinata.cloud/ipfs/${dataset.cid}`;
      const fetchResult = await axiosRequest.get(pinataUrl);
      const { ciphertext, dataToEncryptHash, evmContractConditions } =
        fetchResult.data;

      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: LIT_NETWORK.DatilTest,
        debug: false,
      });
      await litNodeClient.connect();
      const message = dataset.id;
      const signature = await signDataSetId(message);
      const sessionResponse = await axios.post("/api/lit-session", {
        signature,
        message,
        evmContractConditions,
        chain: LIT_PROTOCOL_IDENTIFIER,
        ciphertext,
        dataToEncryptHash,
      });
      const { sessionSigs, decryptedString } = sessionResponse.data;

      console.log(decryptedString);
      const blob = new Blob([decryptedString], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = dataset.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      rethrowFailedResponse(response);
      toast.success("Download started!");
      setCanAccessDataset(true);
    } catch (error) {
      console.log(JSON.stringify(error.message));
      console.error("Download failed", error);
      toast.error(`Failed to download dataset ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseAccessOnChain = async () => {
    try {
      console.log(dataset);
      setIsLoading(true);

      const response = await purchaseAccess(dataset.id);
      rethrowFailedResponse(response);
      toast.success("Access purchased successfully!");
      setCanAccessDataset(true);
    } catch (error) {
      console.log(error.message);
      console.error("Error purchasing access:", error);
      toast.error(`Failed to purchase access. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    canAccessCall();
  }, [dataset]);
  return (
    <div key={dataset.id} className="bg-white p-5 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{dataset.name}</h3>
      <p className="text-gray-600 mt-2">{dataset.description}</p>
      <p className="mt-4 text-gray-700">
        <strong>Category:</strong> {dataset.category}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Rating:</strong> {dataset.rating} ⭐
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Verified:</strong> {dataset.verified ? "Yes" : "No"}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Creator:</strong> {ellipsify(dataset.creator)}
      </p>

      <CSVPreview previewRows={JSON.parse(dataset.preview)} />
      <button
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={canAccessDataset ? downloadDataset : purchaseAccessOnChain}
        disabled={isLoading}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-3xl" />
        ) : canAccessDataset ? (
          "Download Dataset"
        ) : (
          `Access Dataset ${dataset.priceIntFIL} tFIL`
        )}
      </button>
    </div>
  );
};

export default DatasetItem;
