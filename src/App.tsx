import React from "react";
import "./App.css";
import { Launcher, Window, useLaunch, useIsOpen } from "@relaycc/receiver";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Routes, Route, Link } from "react-router-dom";
import MomentsCreation from "./Pages/MomentsCreation";
import Chatbox from "./Components/Chatbox";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Moments />} />
      <Route path="dynamic" element={<DynamicExample />} />
    </Routes>
  );
}


function Moments(){
  return(
    <>
    <MomentsCreation />
    </>
  )
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

  return (
    <div className="full-flex-centered">
      <h1 className="header"></h1>

      <ConnectButton />
      <h1>Chat with your Friends whom you have capured Moments</h1>
      <Chatbox />
      {/* <button
        className="launch-receiver hover-scale"
        onClick={() => launch("0x0cb27e883E207905AD2A94F9B6eF0C7A99223C37")}
      >
        Kraznik.eth
      </button> */}
      {/* <h1>You can message anyone with an ETH account</h1> */}
      {/* <button
        className="launch-receiver hover-scale"
        onClick={() => launch("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")}
      >
        Even Vitalik!
      </button> */}
      <Window />
    </div>
  );
}

export default App;
