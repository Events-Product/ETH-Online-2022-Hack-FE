import * as EpnsAPI from "@epnsproject/sdk-restapi";
import * as ethers from "ethers";

// const ReceiptWalletAddress = "0x66Dc3BFCD29E24fDDeE7f405c705220E6142e4cD";
const ChannelAddress = "0x10881d13359A14652F0e62a37157e08eF6B46636";

const PK = `${process.env.REACT_APP_PKEY}`; // channel private key
const Pkey = `0x${process.env.REACT_APP_PKEY}`;
const signer = new ethers.Wallet(Pkey);

export const sendNotification = async (account, ReceiptWalletAddress) => {
  try {
    console.log("Sending Notifct");
    const apiResponse = await EpnsAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `${account} Invited you to chat with him/her at XMTP V1`,
        body: `${account} Invited you to chat with him/her at XMTP V1`,
      },
      payload: {
        title: `${account} Invited you to chat with him/her at XMTP V1`,
        body: `${account} Invited you to chat with him/her at XMTP V1`,
        cta: "https://www.youtube.com/",
        img: "",
      },
      recipients: `eip155:42:${ReceiptWalletAddress}`, // recipient address
      channel: `eip155:42:${ChannelAddress}`, // your channel address
      env: "staging",
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse:", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};
