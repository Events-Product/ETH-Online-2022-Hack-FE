import React, { useState } from "react";
import "./App.css";
import { Launcher, Window, useLaunch, useIsOpen } from "@relaycc/receiver";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Routes, Route, Link } from "react-router-dom";
import MomentsCreation from "./pages/MomentsCreation";
import Chatbox from "./components/Chatbox";
import axios from "axios";
import { useAccount } from "wagmi";
import {Subscribe} from "./components/OptInChannel"

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
  const launch = useLaunch();
  const { address } = useAccount();

  return (
    <div className="full-flex-centered">
      <h1 className="header">{address}</h1>

      <ConnectButton
        accountStatus="address"
        showBalance={false}
        chainStatus="none"
      ></ConnectButton>

      <h1>Chat with your Friends whom you have capured Moments</h1>
      <Chatbox account={address} />
      <button
          className="launch-receiver hover-scale"
          onClick={() => Subscribe(address)}
        >
          OPT In
        </button>
      {/* <button
        className="launch-receiver hover-scale"
        onClick={() => launch("0x0cb27e883E207905AD2A94F9B6eF0C7A99223C37")}
      >
        Kraznik.eth
      </button> */}
      <Window />
    </div>
  );
}

export default App;
