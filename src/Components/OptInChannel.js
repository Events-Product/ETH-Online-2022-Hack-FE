// any other web3 ui lib is also acceptable
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import * as ethers from "ethers";

import { useWeb3React } from "@web3-react/core";
import { useAccount } from "wagmi";

// const signer = library.getSigner(account);
// const { account, library, chainId } = useWeb3React();

const userWalletAddress = "0x66Dc3BFCD29E24fDDeE7f405c705220E6142e4cD";

export const Subscribe = async (userWalletAddress) => {
  const { signer } = useAccount();
  try {
    await EpnsAPI.channels.subscribe({
      signer: _signer,
      channelAddress: "eip155:42:0x10881d13359A14652F0e62a37157e08eF6B46636", // channel address in CAIP
      userAddress: `eip155:42:${userWalletAddress}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  } catch (err) {
    console.error("Error: ", err);
  }
};
