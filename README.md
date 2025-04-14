# **ProofChain AI** - Decentralized AI Dataset Marketplace

**ProofChain AI** is a decentralized platform that allows users to **upload, verify, and monetize datasets** in a secure, privacy-preserving manner. Built on **Filecoin** for decentralized storage and **IPFS** for fast data retrieval, **ProofChain AI** ensures **cryptographic provenance**, allowing AI developers to access high-quality, validated datasets while guaranteeing transparency and fairness.

## **Key Features**

### 1. **Data Provenance & Integrity**

- Every dataset is **hashed**, **timestamped**, and **stored on IPFS/Filecoin**, ensuring **tamper-proof** and **traceable** data lineage.
- A **record on-chain** (via smart contracts) is created with key metadata: dataset name, type, uploader’s wallet address, timestamp, and the CID (Content Identifier) from IPFS/Filecoin.

### 2. **Decentralized Data Sourcing**

- Contributors **cryptographically sign** their dataset uploads.
- **Peer reviews** and **rating systems** are available to validate dataset quality.
- Contributors are **rewarded in tokens** based on dataset demand and usage.

### 3. **Efficient AI Development**

- Datasets are optimized for **efficient access**: AI developers can retrieve only parts of the dataset they need.
- Built-in preprocessing via Flask allows developers to filter or transform data on-the-fly for model training.
- Easy integration with popular AI frameworks like TensorFlow, PyTorch, and Scikit-learn.

### 4. **Tokenized Monetization & Fair Distribution**

- Dataset monetization is powered by **smart contracts**, with **100% of the revenue currently directed to the contributor**.
- **Tokenized access**: Datasets are accessible via **tokens** that unlock data for use.
- **Future Enhancements**: Smart contracts will eventually allow revenue splits for other roles, such as validators and curators.

### 5. **Timed and Synchronized Access**

- Using **Lit Protocol** and **Randommu**, datasets can be made accessible only after a specific timestamp or at the same time for everyone, enabling **fair AI training competitions** and **timed releases** for research purposes.

---

## **Getting Started**

### **Prerequisites**

- Install **Python 3.x** and **Flask** for backend development.
- Install **IPFS** and **Filecoin** nodes (or use a hosted service like Infura or Filecoin’s retrieval network).
- Set up **Lit Protocol** for access control (using token-gated permissions).

### **Install Dependencies**

```bash
pip install flask web3
```

For **frontend**:

```bash
npm install react @web3uikit/core ipfs-http-client
```

---

## **How It Works**

### **1. Upload a Dataset**

- Contributors upload their datasets to **IPFS** and store them on **Filecoin**.
- A **CID** is generated for each dataset and is used as a unique fingerprint.
- A record is created on-chain with metadata: dataset name, uploader wallet, and CID.

### **2. Dataset Discovery**

- AI developers can search for datasets through the **dataset explorer**.
- They can apply filters based on categories (e.g., medical, finance, etc.), ratings, and metadata.
- Datasets are accessible via **IPFS gateways** or direct retrieval from Filecoin.

### **3. Monetize the Dataset**

- Datasets are **tokenized** and can be accessed by paying with the **ProofChain token**.
- **Smart contracts** manage payments, with 100% of the revenue going directly to the dataset contributor.

### **4. Peer Review and Validation**

- **Community-driven validation**: Datasets can be reviewed, rated, and flagged by the community.
- Verified datasets increase visibility and attract more demand.

---

## **Future Roadmap**

### ✅ **Phase 1 – MVP (Q2 2025)**

- Dataset upload via **IPFS/Filecoin**.
- Metadata registry on-chain (CID, timestamp, contributor info).
- Flask backend for **model training** and **prediction APIs**.
- **Tokenized access** via **Lit Protocol**.
- **Smart contracts** for dataset monetization, with all revenue going to the contributor.

### 🚧 **Phase 2 – Marketplace Launch (Q3 2025)**

- Dataset explorer with **search**, **filters**, and **peer reviews**.
- Token economy (ProofChain Token) and **future revenue splits** for validators/curators.
- Dataset rating and flagging system.

### 🔜 **Phase 3 – AI Developer Tools & Ecosystem Growth (Q4 2025)**

- **Python SDK** for seamless AI integration.
- **Timed dataset access** with **Randommu** and **Lit Protocol**.
- Tools for **AI competitions** and **fair access** to datasets.
- Usage analytics and **contributor dashboards** for performance tracking.

### 🚀 **Phase 4 – Scale & Interoperability (2026)**

- Multi-chain support (FVM, L2s, cross-chain dataset provenance).
- Privacy-preserving data sharing using **zkProofs/FHE**.
- **DAO governance** for platform upgrades, grants, and ecosystem development.
- Integration with **research labs**, **academic institutions**, and **AI companies**.

---

Sure! Here's the section you can add under a new heading like **"Known Issues / Troubleshooting"**:

---

## **Known Issues / Troubleshooting**

### 🛠️ `randmu` Integration Issue

While integrating **Randommu** for timed dataset access, we encountered an issue with the `blocklock-js` package:

> ❗ The `package.json` in `blocklock-js` points to `index.js`, but that file does not exist. Only `index.cjs` is available.

**Fix**:  
Manually update the `main` field in `node_modules/blocklock-js/package.json`:

```json
{
  "name": "blocklock-js",
  "version": "0.0.8-rc1",
  "description": "A library for encrypting and decrypting data for the future",
  "source": "src/index.ts",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/esm/index.cjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/cjs/index.cjs"
      },
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/esm/index.cjs"
      }
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "npm run clean && npm run build:solidity && npm run build:generate && npm run build:esm && npm run build:cjs && npm run build:types",
    "build:solidity": "(cd ./blocklock-solidity && forge build && cd ..)",
    "build:generate": "mkdir -p src/generated && npx typechain --target ethers-v6 --out-dir src/generated './blocklock-solidity/out/*.sol/*.json'",
    "build:esm": "esbuild src/index.ts --bundle --platform=browser --format=esm --outdir=dist/esm --sourcemap --target=es2020 --out-extension:.js=.mjs",
    "build:cjs": "esbuild src/index.ts --bundle --platform=node --format=cjs --outdir=dist/cjs --sourcemap --target=es2020 --out-extension:.js=.cjs",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rm -rf dist",
    "lint": "eslint src",
    "lint:fix": "eslint --fix",
    "test": "jest ./test/*.test.ts"
  },
  "keywords": [
    "conditional",
    "timelock",
    "encryption",
    "dcipher",
    "randamu",
    "threshold",
    "evm",
    "ethereum"
  ],
  "author": "randa.mu",
  "license": "Apache-2.0/MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/randa-mu/blocklock-js.git"
  },
  "bugs": {
    "url": "https://github.com/randa-mu/blocklock-js/issues"
  },
  "homepage": "https://github.com/randa-mu/blocklock-js#readme",
  "dependencies": {
    "@noble/curves": "^1.6.0",
    "@noble/hashes": "^1.5.0",
    "asn1js": "^3.0.5",
    "buffer": "^6.0.3",
    "ethers": "^6.13.4",
    "mcl-wasm": "^1.7.0"
  },
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@typechain/ethers-v6": "^0.5.1",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.7.5",
    "dotenv": "^16.4.5",
    "esbuild": "^0.24.0",
    "eslint": "^9.17.0",
    "ganache": "^7.9.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typechain": "^8.3.2",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.11.0"
  },
  "engines": {
    "node": ">= 22.0.0"
  }
}
```

This allows the package to load correctly during runtime.

## **Contribute**

ProofChain AI is an open-source project! We welcome contributions to help enhance the platform and build a sustainable AI ecosystem.

- Fork the repository, open an issue, or submit a pull request.
- Join our **Discord** community for discussions and collaboration.

---

## **License**

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for more information.

---
