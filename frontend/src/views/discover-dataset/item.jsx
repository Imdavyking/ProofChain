import { ellipsify } from "../../utils/ellipsify";
import React, { useEffect, useState } from "react";
import CSVPreview from "../csv-preview/main";
import {
  canAccess,
  purchaseAccess,
  rethrowFailedResponse,
} from "../../services/blockchain.services";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
const DatasetItem = ({ dataset }) => {
  const [canAccessDataset, setCanAccessDataset] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const canAccessCall = async () => {
    const userCanDownload = await canAccess(dataset.id);
    setCanAccessDataset(userCanDownload);
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
        onClick={async () => {
          try {
            setIsPurchasing(true);
            const response = await purchaseAccess(dataset.id);
            rethrowFailedResponse(response);
            toast.success("Access purchased successfully!");
            setCanAccessDataset(true);
          } catch (error) {
            console.log(error.message);
            console.error("Error purchasing access:", error);
            toast.error(`Failed to purchase access. ${error.message}`);
          } finally {
            setIsPurchasing(false);
          }
        }}
        disabled={isPurchasing}
      >
        {isPurchasing ? (
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
