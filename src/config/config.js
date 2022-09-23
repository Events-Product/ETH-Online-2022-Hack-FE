const configTestnet = {
  chainId: 80001,
  apiBaseUrl: "https://ethglobalhack.kraznikunderverse.com", // "http://localhost:3456"
  authOptions: {
    headers: {
      validate: process.env.REACT_APP_VALIDATE_TOKEN,
    },
  },
  dgApiBaseUrl: "https://api-main.doingud.work",
  dgAppBaseUrl: "https://main.doingud.work",
  alchemyUrl: `https://polygon-mumbai.g.alchemy.com/v2/WWvtjuEXcDbNHpx1f65J2dF3PP8JhVwN`,
  ethMainnetUrl: `https://eth-mainnet.g.alchemy.com/v2/QR5C5zzZSEnBkW8aQKWBkoblpPjENnwd`,
  contractAddress: "0x4137cF37598EE871d1F4A6DEE9188217Ed40c649",
  creatorAddress: "0x66Dc3BFCD29E24fDDeE7f405c705220E6142e4cD",
  sio: {
    id: "05dd4c3b-6635-4694-a4f4-11740b82df65",
    decentralizedId: 111,
  },
};

const configMainnet = {
  chainId: 137,
  apiBaseUrl: "https://ethglobalhack.kraznikunderverse.com",
  authOptions: {
    headers: {
      validate: process.env.REACT_APP_VALIDATE_TOKEN,
    },
  },
  dgApiBaseUrl: "https://api.doingud.com",
  dgAppBaseUrl: "https://doingud.com",
  alchemyUrl: `https://polygon-mainnet.g.alchemy.com/v2/VX9hsINm25dNmmBqKi9ydn_iBW4sio4i`,
  ethMainnetUrl: `https://eth-mainnet.g.alchemy.com/v2/QR5C5zzZSEnBkW8aQKWBkoblpPjENnwd`,
  contractAddress: "0xE3A161EdD679fC5ce2dB2316a4B6f7ab33a8eD6A",
  creatorAddress: "0x66Dc3BFCD29E24fDDeE7f405c705220E6142e4cD",
  sio: {
    // id: "707eabb4-bd4f-4c71-a154-ecf614ae56ee", // ETH BCN Donations
    // decentralizedId: 43,
    id: "0246c974-024c-416c-b4c2-23c7207439b4", // Gitcoin
    decentralizedId: 58,
  },
};

export const config =
  process.env.REACT_APP_NETWORK === "mainnet" ? configMainnet : configTestnet;
