import { config } from "../config/config";
import axios from "axios";
import { uploadFile } from "./creations";

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
    setSuccess(true);
    setNftTypeId(nftTypeId);

    // return navigate(`/profile/${}`, { replace: true });
  } catch (err) {
    setMinting(false);
    setError(true);
    console.error(err);
  }
};
