// import web3 from "./web3";
import ABI from "@doingud/contracts/abi/DoinGudDiamondFull.json";
// import { DOINGUD_DIAMOND_ADDRESS } from "@doingud/contracts/dist/adresses";
import { config } from "../config/config";
const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider(config.alchemyUrl);

const web3 = new Web3(provider);

const Diamond = new web3.eth.Contract(ABI, config.contractAddress);

export default Diamond;
