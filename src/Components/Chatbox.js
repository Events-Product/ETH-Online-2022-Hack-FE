import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Launcher, Window, useLaunch, useIsOpen } from "@relaycc/receiver";
import { sendNotification } from "./InviteNotification";
import { sendTaggedNotification } from "./TaggedNotification";
import axios from "axios";
const Container = styled.div`
  display: inline-block;
  width: 400px;
  background: red;
`;
const EPNS = styled.button`
  display: flex;
`;

const Chatbox = ({account}) => {
  const launch = useLaunch();
  const isOpen = useIsOpen();
  const [friendsList, setFriendsList] = useState([]);

  const UserWallet = account;

  const wallets = async () => {
    const url = `https://ethglobalhack.kraznikunderverse.com/getCreated/${UserWallet}`;
    const { data } = await axios.get(url, {
      headers: { validate: process.env.REACT_APP_VALIDATE_TOKEN },
    });
    console.log(data);
    // setFriendsList(data?.data?.addresses);
    setFriendsList(["0x66Dc3BFCD29E24fDDeE7f405c705220E6142e4cD", "jhsbd"]);
  };

  useEffect(() => {
    wallets();
  }, []);

  return (
    <Container>
      {friendsList.map((address) => {
        return (
          <>
            <h1>{address}</h1>
            <EPNS
              className="launch-receiver hover-scale"
              onClick={() => sendNotification(address)}
            >
              Invite
            </EPNS>
            <EPNS
              className="launch-receiver hover-scale"
              onClick={() =>
                launch(address)
              }
            >
              Chat
            </EPNS>
          </>
        );
      })}
    </Container>
  );
};

export default Chatbox;
