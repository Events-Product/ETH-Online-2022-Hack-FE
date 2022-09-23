import axios from "axios";
import { CID } from "multiformats/cid";

import imageDimensions from "./utils/getImageDimensions";
import { getTypeOfMedia } from "./utils/upload";
import { buildFormData } from "./utils/buildFormData";

import Diamond from "../ethereum/Diamond";
import { config } from "../config/config";
import { resolveEns } from "./utils/resolve";

const baseUrl = `${config.dgApiBaseUrl}`;

var numberOfEditions;
var collabWallet;

export const uploadFile = async (file, AccessToken, momentsData) => {
  const { title, description, walletAddresses } = momentsData;
  // const { title, description, maxEditions, collabAddress } = momentsData;
  // numberOfEditions = maxEditions;
  numberOfEditions = walletAddresses.length + 1;
  var collabAddress = walletAddresses[0];

  var resolvedAddress = collabAddress;
  if (collabAddress.trim().length !== 42 && collabAddress.slice(-3) === "eth") {
    resolvedAddress = await resolveEns(collabAddress);
  }

  collabWallet = resolvedAddress;

  console.log("collab wallet: ", collabWallet);

  const fileExtension = file.name.split(".").pop();
  const fileType = getTypeOfMedia(file);

  const dimensions =
    fileType === "image" ? await imageDimensions(file) : undefined;
  try {
    const uploadLink = await axios({
      url: `${baseUrl}/creation/storage/upload-link`,
      data: {
        mimetype: file.type,
        fileExtension,
      },
      method: "POST",
      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });

    // console.log("upload link: ", uploadLink.data);

    const formData = new FormData();
    if (file.type) {
      formData.append("Content-Type", file.type);
    }
    Object.entries(uploadLink.data.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file);

    const res = await axios({
      url: uploadLink.data.url,
      method: "POST",
      data: formData,
      // ...requestConfig,
    });

    console.log("upload result: ", res);

    const createArtworkRes = await createArtwork(
      {
        type: file.type,
        fileExtension: fileExtension,
        fileKey: uploadLink.data.fields["key"],
        dimensions: dimensions || undefined,
      },
      AccessToken
    );

    console.log("createArtworkRes: ", createArtworkRes.data);

    // return;

    const nftTypeId = createArtworkRes.data.nftTypeId;
    console.log("nftTypeId: ", nftTypeId);

    const editRes = await submitEditForm({
      nftTypeId,
      valuesForm: {
        title,
        description,
        collaborators: [
          {
            address: collabWallet,
            username: "",
          },
        ],
      },
      AccessToken,
    });
    console.log("editFormRes: ", editRes.data);

    // return;

    const saleRes = await submitSaleSettingsForm({
      nftTypeId,
      valuesForm: {
        //   title: "Moments Test",
        //   description: "Testing",
      },
      AccessToken,
    });
    console.log("saleFormRes: ", saleRes);

    await Claim(nftTypeId, walletAddresses);

    return nftTypeId;
  } catch (error) {
    console.log("error while uploading artwork");
    throw error;
  }
};

export const createArtwork = async (
  data,
  //   onSuccess,
  //   requestCookies,
  AccessToken
) => {
  //   const cookies = new Cookies(requestCookies);
  const response = await axios({
    data,
    method: "post",
    url: `${baseUrl}/creation/artwork`,
    headers: {
      Authorization: `Bearer ${AccessToken}`,
    },
  });

  //   onSuccess?.(response);
  return response;
};

export const submitArtwork = async (nftTypeId, artwork, AccessToken) => {
  const formData = new FormData();
  buildFormData(formData, artwork);

  return axios({
    method: "put",
    data: formData,
    url: `${baseUrl}/creation/artwork/${nftTypeId}`,
    headers: {
      Authorization: `Bearer ${AccessToken}`,
    },
  });
};

export const submitArtworkSaleSettings = async (
  nftTypeId,
  saleSettings,
  AccessToken
) => {
  return axios({
    method: "put",
    data: saleSettings,
    url: `${baseUrl}/creation/artwork/${nftTypeId}/sale-settings`,
    headers: {
      Authorization: `Bearer ${AccessToken}`,
    },
  });
};

const submitEditForm = async ({
  nftTypeId,
  valuesForm,
  AccessToken,
  isPublished = true,
  includeSale = true,
}) => {
  const {
    // sio,
    // tags,
    title,
    description,
    // collection,
    // thumbnailFile,
    collaborators,
    // unlockableContent,
  } = valuesForm;

  const creatorTypeId = parseInt(nftTypeId.slice(-12), 16);

  if (includeSale) {
    var saleSetting = await getSalesSettings(
      valuesForm,
      nftTypeId,
      creatorTypeId
    );
    console.log("sale setting: ", saleSetting);
  }

  const model = {
    // tags,
    title,
    description,
    // collection,
    sioId: config.sio.id, // "05dd4c3b-6635-4694-a4f4-11740b82df65", // "2402b5bd-a955-495b-8f27-7ab614171ef5", // sio.id | // Hope for Justice Sio ig
    collaborators: collaborators.map((collaborator) => ({
      address: collaborator.address,
      name: collaborator.username,
    })),
    // thumbnailFile:
    //   thumbnailFile && thumbnailFile?.length > 0 ? thumbnailFile[0] : undefined,
    // unlockableContent,
    publish: isPublished,
    ...(includeSale && { saleSetting }),
  };

  return await submitArtwork(nftTypeId, model, AccessToken).catch((err) => {
    console.error(err);
  });
};

const submitSaleSettingsForm = async ({
  nftTypeId,
  valuesForm,
  AccessToken,
}) => {
  const creatorTypeId = parseInt(nftTypeId.slice(-12), 16);
  const saleSetting = await getSalesSettings(
    valuesForm,
    nftTypeId,
    creatorTypeId
  );
  // console.log("sale setting form: ", saleSetting);
  return await submitArtworkSaleSettings(
    nftTypeId,
    saleSetting,
    AccessToken
  ).catch((err) => {
    console.error(err);
  });
};

const getSalesSettings = async (valuesForm, nftTypeId, creatorTypeId) => {
  const price = 0,
    editionCount = numberOfEditions, // 10,
    sellOnProfile = true,
    creatorProfits = 95,
    sioProfits = 5,
    secondarySioProfits = 2.5,
    secondaryCreatorProfits = 20,
    signedAt = new Date();

  let values = {
    // sio: "2402b5bd-a955-495b-8f27-7ab614171ef5",
    creatorShares: [
      {
        id: config.creatorAddress,
        profit: 0,
        isLocked: true,
      },
      {
        id: collabWallet,
        profit: 10000,
        isLocked: true,
      },
    ],
    editionCount: numberOfEditions, // 10,
    price: 0,
    secondaryCreatorProfits,
    secondarySioProfits,
    sioProfits,
    signedAt,
    metadataCID: "bafybeier5ddletuco4b7tdv5dl336j6vvw27agivuablaibgjuvtqnir4a",
    expirationTime: Math.floor(+Date.UTC(2099, 0, 1) / 1000),
  };

  try {
    const url = `${baseUrl}/creation/artwork/${nftTypeId}`;
    const { data } = await axios.get(url);
    // creatorSignature = data.saleSetting.signature;
    if (data) {
      values.metadataCID = data?.metadataCID;
    }
  } catch (err) {
    console.error(err);
  }

  const signature = await getLazyMintSignature(values, creatorTypeId);

  //    = valuesForm;

  const distribution = getDistributionProfit(values.creatorShares);

  console.log("distribution: ", distribution);

  // let distribution = {};
  // distribution[config.creatorAddress] = 0;
  // distribution[collabWallet] = 10000;

  // console.log("distribution: ", distribution);

  return {
    ...(sellOnProfile && {
      price,
      signature,
      signedAt: signedAt?.toISOString(),
      editionNumber: editionCount,
    }),
    publicProfileSale: sellOnProfile, // sellOnProfile,
    primaryMarket: {
      creatorsProfit: creatorProfits,
      socialCauseProfit: sioProfits,
      distribution,
    },
    secondaryMarket: {
      creatorsRoyalties: secondaryCreatorProfits,
      socialCauseRoyalties: secondarySioProfits,
    },
  };
};

export const getDistributionProfit = (creatorShares) => {
  const sharing = {};
  creatorShares.forEach((share) => {
    sharing[share.id] = share.profit;
  });

  return sharing;
};

const getLazyMintSignature = async (values, creatorTypeId) => {
  const params = getLazyMintParams({
    // artwork,
    valuesForm: values,
    creatorTypeId,
  });
  // console.log("Lazy mint params: ", params);

  let signature = "";

  try {
    const hash = await Diamond.methods.hashLazyMint(params).call(); //.call();
    // console.log("sig hash: ", hash);

    try {
      // const url = `https://honetpot.kraznikunderverse.com/getLazyMintSignature/ethcc`;
      const url = `${config.apiBaseUrl}/getLazyMintSignature`;
      const post_data = {
        hash,
      };
      const { data } = await axios.post(url, post_data, config.authOptions);
      signature = data.signature;

      // console.log("signature data from api: ", data);
    } catch (err) {
      throw err;
      console.error(err);
    }

    // console.log("signature: ", signature);
  } catch (err) {
    console.error(err);
    throw err;
  }
  return signature;
};

const getLazyMintParams = ({
  // artwork,
  valuesForm,
  creatorTypeId,
}) => {
  const {
    // sio, // RegisteredSio
    creatorShares, // CreatorProfitForm[]
    editionCount,
    price,
    secondaryCreatorProfits,
    secondarySioProfits,
    sioProfits,
    signedAt, // Date
    metadataCID,
    expirationTime,
  } = valuesForm;

  // const coCreators = [...creatorShares]; //as CreatorProfitForm[]; // equal arrays
  // const creator = coCreators.shift(); // remove the zeroth element and returns it

  // const collabs = coCreators.map((collaborator) => collaborator.id);
  // const collabPortions = coCreators.map(
  //   (collaboratorShare) => collaboratorShare.profit
  // );

  const collabs = [collabWallet];
  console.log("collabs: ", collabs);

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  // console.log("ipfsCid: ", CID.parse(metadataCID).toV1().bytes);

  return {
    nftTypeDefinition: {
      creator: config.creatorAddress, // creator.id, // id of CreatorProfitForm // that was probably eth address
      creatorTypeId, // artwork.creatorArtworkNumber, // number
      collabs, // [] // array of eth addresses of the collaborators // other than the creator
      collabPortions: [10000], // [] // array of profits of collabs
      sioId: config.sio.decentralizedId, // 111, // sio.decentralizedId, // 107 // For Hope of Justice
      maxEditions: editionCount,
      // maxMintsPerAddress: editionCount,
      mintPortionSio: Math.floor(sioProfits * 100),
      resalePortionSio: Math.floor(secondarySioProfits * 100),
      resalePortionCreator: Math.floor(secondaryCreatorProfits * 100),
      ipfsCid: CID.parse(metadataCID).toV1().bytes, //"QmfS9KJXxkKLNy8k8aEbJzZQn64WN1CjPphdsp3dPUT2gM", // ,
    },
    buyer: ZERO_ADDRESS,
    gallery: ZERO_ADDRESS, // "0xAEde54862c0BE447Fcac57c6cAb0EDfaa6f6697e", //
    numOffered: editionCount,
    price, // parseUnits(getPriceWithDGFee(price), 6),
    expirationTime: Math.floor(+Date.UTC(2099, 0, 1) / 1000),
    nonce: signedAt.getTime(), // "1000000000000",
  };
};

const Claim = async (nftTypeId, walletAddresses) => {
  // console.log("nft type id: ", nftTypeId);

  let values = {
    // sio: "2402b5bd-a955-495b-8f27-7ab614171ef5",
    creatorShares: [
      {
        id: config.creatorAddress,
        profit: 0,
        isLocked: true,
      },
    ],
    editionCount: numberOfEditions, // 10,
    price: 0,
    secondaryCreatorProfits: 20,
    secondarySioProfits: 2.5,
    sioProfits: 5,
    signedAt: new Date(),
    metadataCID: "",
    expirationTime: Math.floor(+Date.UTC(2099, 0, 1) / 1000),
  };
  let creatorSignature = "";

  const creatorTypeId = parseInt(nftTypeId.slice(-12), 16);

  try {
    const url = `${baseUrl}/creation/artwork/${nftTypeId}`;
    const { data } = await axios.get(url);
    creatorSignature = data.saleSetting.signature;
    values.metadataCID = data.metadataCID;
    values.signedAt = new Date(data.saleSetting.signedAt);
  } catch (err) {
    console.error(err);
  }

  // console.log("params values in claim: ", values);

  const params = getLazyMintParams({
    // artwork,
    valuesForm: values,
    creatorTypeId,
  });

  // console.log(params);

  try {
    // const url = `http://localhost:3456/mintMoments`;
    const url = `${config.apiBaseUrl}/mintMoments`;

    const post_data = {
      walletAddresses,
      nftTypeId,
      params,
    };
    const { data } = await axios.post(url, post_data, config.authOptions);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
