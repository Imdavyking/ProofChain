import { useState } from "react";
import axios from "axios";

export default function UploadNow() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return;

    if (uploadedFile.type !== "text/csv") {
      setError("Only CSV files are supported.");
      setFile(null);
      return;
    }

    setFile(uploadedFile);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post("/api/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("✅ File uploaded successfully!");
      setError("");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("❌ Upload failed.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Upload your Dataset (CSV)
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100 cursor-pointer"
        />

        {file && (
          <div className="mt-4 text-green-600 text-sm">
            ✅ Uploaded: {file.name}
          </div>
        )}

        {error && <div className="mt-4 text-red-600 text-sm">⚠️ {error}</div>}
        {success && (
          <div className="mt-4 text-green-600 text-sm">{success}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file}
          className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-semibold ${
            file
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Upload Now
        </button>
      </div>
    </div>
  );
}
