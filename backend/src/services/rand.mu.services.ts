import { ethers, getBytes } from "ethers";
import {
  Blocklock,
  SolidityEncoder,
  encodeCiphertextToSolidity,
} from "blocklock-js";
import { environment } from "../utils/config";
export const encryptCid = async (cid: string, extraBlocks: number) => {
  const provider = new ethers.JsonRpcProvider(environment.RPC_URL);
  const wallet = new ethers.Wallet(environment.PRIVATE_KEY, provider);
  const blocklockjs = new Blocklock(wallet, environment.BLOCKLOCK_SENDER_PROXY);

  const blockHeight = BigInt((await provider.getBlockNumber()) + extraBlocks);

  // Encode the uint256 value
  const encoder = new SolidityEncoder();
  const msgBytes = encoder.encodeString(cid);
  const encodedMessage = getBytes(msgBytes);

  // Encrypt the encoded message
  const randMuCiphertext = blocklockjs.encrypt(encodedMessage, blockHeight);

  // Call `createTimelockRequest` on the user's contract

  return { randMuCiphertext, blockHeight };
};
