// import Web3 from "web3";
const Web3 = require("web3");
const { config } = require("../config/config");

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(config.alchemyUrl);
  web3 = new Web3(provider);
}

module.exports = web3;
