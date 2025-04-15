import { LIT_ABILITY, LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { getSigner } from "./blockchain.services";
import { LIT_PROTOCOL_IDENTIFIER } from "../utils/constants";
import { ethers as ethersv5 } from "ethers-v5";

export const mintCapacityNFT = async () => {
  try {
    const provider = new ethersv5.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const ethersSigner = provider.getSigner();

    ethersSigner.provider?.getBlockNumber().then((blockNumber) => {
      console.log("Current block number:", blockNumber);
    });
    console.log("🔄 Connecting LitNodeClient to Lit network...");
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected LitNodeClient to Lit network");

    console.log({ ethersSigner });

    console.log("🔄 Connecting LitContracts client to network...");
    const litContracts = new LitContracts({
      signer: ethersSigner,
      network: LIT_NETWORK.DatilDev,
      debug: false,
    });
    await litContracts.connect();
    console.log("✅ Connected LitContracts client to network");

    let capacityTokenId;

    if (!capacityTokenId) {
      console.log("🔄 Minting Capacity Credits NFT...");
      capacityTokenId = (
        await litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 1,
        })
      ).capacityTokenIdStr;
      console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    }

    console.log("🔄 Creating capacityDelegationAuthSig...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersSigner,
        capacityTokenId,
        delegateeAddresses: [await ethersSigner.getAddress()],
        uses: "1",
      });
    console.log(`✅ Created the capacityDelegationAuthSig`);

    console.log("🔄 Getting Session Sigs via an Auth Sig...");
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: LIT_PROTOCOL_IDENTIFIER,
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      capabilityAuthSigs: [capacityDelegationAuthSig],
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: await ethersSigner.getAddress(),
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });
    console.log(
      `✅ Got Session Sigs via an Auth Sig ${JSON.stringify(sessionSigs)}`
    );
    return { sessionSigs };
  } catch (error) {
    console.log(error);
  }
};
