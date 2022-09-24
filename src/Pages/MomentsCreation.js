import React, { useState, useEffect } from "react";
// import { Subscribe } from "../components/OptInChannel";
import styled from "styled-components"
import { useNavigate } from "react-router-dom";

import { config } from "../config/config";
import {
  getAccessToken,
  retrieveFile,
  mintAMoment,
} from "../functions/mintAMoment";

import { Resolution } from "@unstoppabledomains/resolution";

import { toChecksumAddress } from "ethereum-checksum-address";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Web3 from "web3";

const Leaderboard = styled.div`
display:inline-block;
justify-content: space-around; 
`

const Text = styled.h1`
display:inline-block;
margin: 10px;
`

const MomentsCreation = () => {
  const navigate = useNavigate();
  const [AccessToken, setAccessToken] = useState();
  const [file, setFile] = useState();
  const [nftTypeId, setNftTypeId] = useState();
  //for profile
  const [enteredWallet, setEnteredWallet] = useState();
  const [walletAddresses, setWalletAddresses] = useState();
  const [momentsData, setMomentsData] = useState({
    title: "",
    description: "",
    walletAddresses: [],
  });

  const [validTicketIds, setValidTicketIds] = useState([]);
  const [invalidTicketIds, setInvalidTicketIds] = useState([]);

  const [popup, setPopup] = useState(false);
  const [minting, setMinting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [Error, setError] = useState(false);

  useEffect(() => {
    getAccessToken(setAccessToken);
  }, []);

  const resolvedUNS = async (domain, currency = "ETH") => {
    try {
      const resolution = new Resolution();
      const address = await resolution.addr(domain, currency);
      return address;
    } catch (err) {
      console.error(err);
    }
  };

  const getListOfWalletAddresses = async (walletAddresses) => {
    try {
      console.log(walletAddresses);
      let walletAddressList = walletAddresses.split(",").map((address) => {
        if (address === "" || address === " ") return null;
        return address.trim();
      }); // split(/,|, /);

      walletAddressList = walletAddressList.filter(
        (address) => address !== null
      );
      console.log("wallet addresses: ", walletAddressList);

      let validOnes = [],
        invalidOnes = [];

      for (let i = 0; i < walletAddressList.length; i++) {
        var walletAddress = "";
        let address = walletAddressList[i].trim();
        try {
          if (address.trim().length !== 42 && address.slice(-3) === "eth") {
            var provider = new Web3.providers.HttpProvider(
              config.ethMainnetUrl
            );
            const web3 = new Web3(provider);
            walletAddress = await web3.eth.ens.getAddress(address.trim());
            console.log("wallet address: ", walletAddress);
          } else if (
            address.slice(-6) === "wallet" ||
            address.slice(-6) === "crypto" ||
            address.slice(-3) === "nft" ||
            address.slice(-10) === "blockchain" ||
            address.slice(-7) === "bitcoin" ||
            address.slice(-4) === "coin" ||
            address.slice(-3) === "888" ||
            address.slice(-3) === "dao" ||
            address.slice(-1) === "x"
          ) {
            walletAddress = await resolvedUNS(address, "ETH");
            console.log("wallet from uns: ", walletAddress);
          }
        } catch (err) {
          console.log("error resolving ens name");
          console.error(err);
        }

        console.log(i, " ", walletAddress, address);
        // && walletAddressList[i - 1] !== walletAddress
        if (walletAddress) {
          walletAddressList[i] = walletAddress;
          address = walletAddress;
        }

        if (address.length == 42) address = toChecksumAddress(address);

        if (address.length == 42 && toChecksumAddress(address)) {
          const card = renderValidTicketIds(address, i);
          validOnes.push(card);
        } else {
          const card = renderInvalidTicketIds(address, i);
          invalidOnes.push(card);
        }
      }

      setValidTicketIds(validOnes);
      setInvalidTicketIds(invalidOnes);

      // console.log("valid: ", validOnes);
      // console.log("invalid: ", invalidOnes);

      walletAddressList = walletAddressList.map((address) => {
        if (address.length === 42) {
          console.log("checksum: ", toChecksumAddress(address));
          return toChecksumAddress(address);
        }
        return address;
      });

      console.log("final: ", walletAddressList);

      setMomentsData({ ...momentsData, walletAddresses: walletAddressList });
    } catch (err) {
      console.error(err);
    }
  };

  const renderValidTicketIds = (walletAddress, i) => {
    return (
      <>
        <div className="correct" key={walletAddress}>
          {walletAddress.slice(0, 4)}....{walletAddress.slice(-4)}
        </div>
        <br />
      </>
    );
  };

  const renderInvalidTicketIds = (walletAddress, i) => {
    return (
      <>
        <div className="incorrect" key={walletAddress}>
          {walletAddress.slice(0, 4)}....{walletAddress.slice(-4)}
        </div>
        <br />
      </>
    );
  };

  return (
    <>
      <h1>Create Moments</h1>
      <>
        <>
          <form>
            <h2>Title</h2>
            <input
              type="text"
              placeholder="Whats the Title"
              value={momentsData.title}
              onChange={(e) => {
                setMomentsData({ ...momentsData, title: e.target.value });
              }}
            />
            <h2>Description</h2>
            <input
              type="text"
              placeholder="whats the moment About"
              className="input"
              value={momentsData.description}
              onChange={(e) => {
                setMomentsData({
                  ...momentsData,
                  description: e.target.value,
                });
              }}
            ></input>
            <h2>ETH Address (Tag Your Friends)</h2>
            <input
              multiple
              type="text"
              placeholder="weed.eth, lsd.dao, coke.nft"
              className="input"
              value={walletAddresses}
              onChange={(e) => {
                getListOfWalletAddresses(e.target.value);
                setWalletAddresses(e.target.value);
              }}
            ></input>
            <p>Ex. test.eth, lsd.dao etc. (seprated by comma)</p>

            <input
              type="file"
              id="myFile"
              name="filename"
              onChange={(e) => retrieveFile(e, setFile)}
            />
            <br />
          </form>
          <button
            onClick={() => {
              setPopup(true);
              setError(false);
              setSuccess(false);
            }}
            style={{
              pointerEvents: popup ? "none" : null,
            }}
          >
            Mint a Moment
          </button>

          {minting ? <div>Minting...</div> : null}
          {Error ? <div>Got some Error...Please try again</div> : null}
          {success ? (
            <div>
              Successfully minted!
              <a
                target={"_blank"}
                href={`${config.dgAppBaseUrl}/creation/${nftTypeId}`}
              >
                Visit your moment
              </a>
            </div>
          ) : null}
        </>
      </>

      {/* PopUp to conifrm the NFTID's */}

      {popup ? (
        <div>
          <div className="box-third">
            <div onClick={() => setPopup(false)}>Close</div>

            <div className="title">
              Please Confirm the ETH Address Before Minting
            </div>

            {validTicketIds}

            {invalidTicketIds.length > 0 ? (
              <>
                <div className="invalid">
                  Invalid ETH Address (Please input again)
                </div>
                <div className="yy">{invalidTicketIds}</div>
              </>
            ) : null}

            <button
              className="mintmoment"
              disabled={
                invalidTicketIds.length > 0 || minting || success ? true : false
              }
              onClick={() =>
                mintAMoment(
                  file,
                  AccessToken,
                  momentsData,
                  setNftTypeId,
                  setError,
                  setMinting,
                  setSuccess,
                  navigate
                )
              }
            >
              {minting ? <span>Minting...</span> : <span>Mint My Moment</span>}
            </button>

            {minting ? (
              <div style={{ color: "blacl" }}>
                Please have patience...it's minting...
              </div>
            ) : null}

            {success ? (
              <>
                <div style={{ color: "black" }}>Successfully minted!!</div>
                {nftTypeId ? (
                  <div>
                    <a
                      href={`${config.dgAppBaseUrl}/creation/${nftTypeId}`}
                      target={"_blank"}
                      style={{ color: "black" }}
                    >
                      View your moment here -
                    </a>
                  </div>
                ) : null}
              </>
            ) : null}

            {Error ? (
              <div style={{ color: "black" }}>Got some Error!!</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <a href="/dynamic">
        <button className="launch-receiver hover-scale">
          {" "}
          View your Connections
        </button>
      </a>


      <>
      <Leaderboard>
        <Text>Rank</Text>
        <Text>Creator</Text>
        <Text>Moments </Text>
        <Text>Moments Captured</Text>
        <Text>Moments Tagged</Text>
      </Leaderboard>
      
      </>
    </>
  );
};

export default MomentsCreation;
