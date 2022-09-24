import React, { useState } from "react";
import "./App.css";
import {
  Launcher,
  Window,
  useLaunch,
  useIsOpen,
  Intercom,
} from "@relaycc/receiver";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Routes, Route, Link } from "react-router-dom";
import MomentsCreation from "./Pages/MomentsCreation";
import Chatbox from "./Components/Chatbox";
import axios from "axios";
import { useAccount } from "wagmi";
import Header from "./assests/Header.png";
// import {Subscribe} from "./Components/OptInChannel"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Moments />} />
      <Route path="dynamic" element={<DynamicExample />} />
    </Routes>
  );
}

function Moments() {
  return (
    <>
      <MomentsCreation />
    </>
  );
}

function BasicExample() {
  const launch = useLaunch();
  const isOpen = useIsOpen();

  return (
    <div className="full-flex-centered">
      <ConnectButton />
      {isOpen || (
        <button
          className="launch-receiver hover-scale"
          onClick={() => launch()}
        >
          Launch Receiver
        </button>
      )}
      {isOpen && (
        <div className="receiver-is-open">Receiver Window is Open</div>
      )}

      <Window />
    </div>
  );
}

function DynamicExample() {
  // const launch = useLaunch();
  const { address } = useAccount();

  return (
    <div className="box">
      <img src={Header} width="100%" />
      <div className="wallet">
      <ConnectButton
        accountStatus="address"
        showBalance={false}
        chainStatus="none"
      ></ConnectButton>
      </div>

      <Chatbox account={address} />
      <div className="chat">
      <Intercom>
        <Window />
      </Intercom>
      </div>
      {/* <Window /> */}
      {/* <button
          className="launch-receiver hover-scale"
      
        >
          OPT In
        </button> */}
    </div>
  );
}

export default App;
