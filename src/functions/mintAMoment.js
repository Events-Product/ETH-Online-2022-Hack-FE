import { config } from "../config/config";
import axios from "axios";
import { uploadFile } from "./creations";
import { sendTaggedNotification } from "../Components/TaggedNotification";

export const getAccessToken = async (setAccessToken) => {
  try {
    const url = `${config.apiBaseUrl}/getAccessToken`;
    const { data } = await axios.get(url);
    console.log("access token: ", data);
    setAccessToken(data);
  } catch (err) {}
};

export const retrieveFile = (e, setFile) => {
  const data = e.target.files[0];
  setFile(data);
  console.log("file: ", data);

  e.preventDefault();
};

const postToTableland = async (momentsData) => {
  var wallets = momentsData?.walletAddresses;
  const creatorAddress = wallets.shift();
  const addresses = wallets;

  console.log("creator address: ", creatorAddress);
  console.log("tagged friends: ", addresses);

  const url = `${config.apiBaseUrl}/ethMoments`;
  const postData = { addresses, creatorAddress };
  const { data } = await axios.post(url, postData, config.authOptions);
  console.log("post to tableland: ", data);
};

export const mintAMoment = async (
  file,
  AccessToken,
  momentsData,
  setNftTypeId,
  setError,
  setMinting,
  setSuccess,
  navigate
) => {
  setError(false);
  console.log("minting..");
  setMinting(true);
  try {
    if (file && AccessToken) {
      var nftTypeId = await uploadFile(file, AccessToken, momentsData);
      setMinting(false);
    }
    setNftTypeId(nftTypeId);

    // return navigate(`/profile/${}`, { replace: true });
    await postToTableland(momentsData);
    await sendTaggedNotification(momentsData.walletAddresses);
    setSuccess(true);
  } catch (err) {
    setMinting(false);
    setError(true);
    console.error(err);
  }
};
