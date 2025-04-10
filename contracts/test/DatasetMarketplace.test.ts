import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DatasetMarketplace } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";

describe("DatasetMarketplace", function () {
  let marketplace: DatasetMarketplace & {
      deploymentTransaction(): ContractTransactionResponse;
    },
    owner,
    user1: HardhatEthersSigner,
    user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory("DatasetMarketplace");
    marketplace = await Marketplace.deploy();
  });

  it("should allow uploading datasets", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    const dataset = await marketplace.datasets(0);
    expect(dataset.cid).to.equal("cid1");
    expect(dataset.owner).to.equal(user1.address);
  });

  it("should allow updating datasets", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await marketplace
      .connect(user1)
      .updateDataset(0, "newCid", ethers.parseEther("2"));
    const dataset = await marketplace.datasets(0);
    expect(dataset.cid).to.equal("newCid");
    expect(dataset.price).to.equal(ethers.parseEther("2"));
  });

  it("should fail to update dataset if not owner", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await expect(
      marketplace
        .connect(user2)
        .updateDataset(0, "newCid", ethers.parseEther("2"))
    ).to.be.revertedWithCustomError(
      marketplace,
      "DatasetMarketplace__NotDatasetOwner"
    );
  });

  it("should allow purchasing access", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await marketplace
      .connect(user2)
      .purchaseAccess(0, { value: ethers.parseEther("1") });
    const has = await marketplace.canAccess(0, user2.address);
    expect(has).to.be.true;
  });

  it("should revert if underpaying for access", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await expect(
      marketplace
        .connect(user2)
        .purchaseAccess(0, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWithCustomError(
      marketplace,
      "DatasetMarketplace__InsufficientPayment"
    );
  });

  it("should allow rating a dataset", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await marketplace.connect(user2).rateDataset(0, 4);
    const dataset = await marketplace.datasets(0);
    expect(dataset.starsTotal).to.equal(4);
    expect(dataset.starsCount).to.equal(1);
  });

  it("should revert if user rates more than once", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await marketplace.connect(user2).rateDataset(0, 4);
    await expect(
      marketplace.connect(user2).rateDataset(0, 5)
    ).to.be.revertedWithCustomError(
      marketplace,
      "DatasetMarketplace__AlreadyRated"
    );
  });

  it("should increment downloads only if user has access", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await marketplace
      .connect(user2)
      .purchaseAccess(0, { value: ethers.parseEther("1") });
    await marketplace.connect(user2).recordDownload(0);
    const dataset = await marketplace.datasets(0);
    expect(dataset.downloads).to.equal(1);
  });

  it("should revert download if user has no access", async function () {
    await marketplace
      .connect(user1)
      .uploadDataset("cid1", ethers.parseEther("1"));
    await expect(
      marketplace.connect(user2).recordDownload(0)
    ).to.be.revertedWithCustomError(
      marketplace,
      "DatasetMarketplace__AccessDenied"
    );
  });
});
