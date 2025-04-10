import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";

export const mintCapacityNFT = async () => {
  const walletWithCapacityCredit = new ethers.Wallet(
    "<your private key or mnemonic>"
  );

//   let contractClient = new LitContracts({
//     signer: dAppOwnerWallet,
//     network: LIT_NETWORK.Datil,
//   });

//   await contractClient.connect();

//   // this identifier will be used in delegation requests.
//   const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
//     requestsPerKilosecond: 80,
//     // requestsPerDay: 14400,
//     // requestsPerSecond: 10,
//     daysUntilUTCMidnightExpiration: 2,
//   });

//   const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
//     alertWhenUnauthorized: false,
//     litNetwork: LIT_NETWORK.Datil,
//     debug: false,
//   });

//   const { capacityDelegationAuthSig } =
//     await litNodeClient.createCapacityDelegationAuthSig({
//       uses: "1",
//       signer: wallet,
//       capacityTokenId: capacityTokenIdStr,
//       delegateeAddresses: [walletAddress],
//     });
};
