import Web3 from "web3";
import { Resolution } from "@unstoppabledomains/resolution";
import { config } from "../../config/config";

export const resolveEns = async (address) => {
  var provider = new Web3.providers.HttpProvider(config.ethMainnetUrl);
  const web3 = new Web3(provider);
  const walletAddress = await web3.eth.ens.getAddress(address.trim());
  console.log("wallet address: ", walletAddress);
  return walletAddress;
};

export const resolveUns = async (domain, currency = "ETH") => {
  try {
    const resolution = new Resolution();
    const address = await resolution.addr(domain, currency);
    return address;
  } catch (err) {
    console.error(err);
  }
};
