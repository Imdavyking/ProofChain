import React, { useState, useEffect } from "react";

// Sample datasets for demo purposes
const datasets = [
  {
    id: 1,
    name: "Medical Imaging Data",
    description: "A large collection of medical images.",
    category: "Medical",
    rating: 4.5,
    verified: true,
    creator: "John Doe",
  },
  {
    id: 2,
    name: "Financial Data 2020",
    description: "Stock market data from 2020.",
    category: "Finance",
    rating: 4.2,
    verified: true,
    creator: "Jane Smith",
  },
  {
    id: 3,
    name: "Text Sentiment Dataset",
    description: "Dataset for training sentiment analysis models.",
    category: "Text",
    rating: 4.7,
    verified: false,
    creator: "Alice Johnson",
  },
  // More datasets here...
];

function DiscoverDataset() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    verified: "",
    rating: "",
  });
  const [filteredDatasets, setFilteredDatasets] = useState(datasets);

  useEffect(() => {
    // Filter datasets based on the search and filter criteria
    let filtered = datasets.filter((dataset) => {
      return (
        dataset.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter.category ? dataset.category === filter.category : true) &&
        (filter.verified
          ? dataset.verified.toString() === filter.verified
          : true) &&
        (filter.rating ? dataset.rating >= parseFloat(filter.rating) : true)
      );
    });
    setFilteredDatasets(filtered);
  }, [search, filter]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8">Discover Datasets</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-5 mb-8">
        <select
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          value={filter.category}
        >
          <option value="">Category</option>
          <option value="Medical">Medical</option>
          <option value="Finance">Finance</option>
          <option value="Text">Text</option>
        </select>

        <select
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          onChange={(e) => setFilter({ ...filter, verified: e.target.value })}
          value={filter.verified}
        >
          <option value="">Verified</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>

        <select
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
          onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
          value={filter.rating}
        >
          <option value="">Rating</option>
          <option value="4.0">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      {/* Dataset Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">
              {dataset.name}
            </h3>
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
              <strong>Creator:</strong> {dataset.creator}
            </p>
            <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              View Dataset
            </button>
          </div>
        ))}
      </div>

      {/* Pagination (if needed) */}
      <div className="flex justify-center gap-3 mt-8">
        <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Previous
        </button>
        <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>
  );
}

export default DiscoverDataset;
