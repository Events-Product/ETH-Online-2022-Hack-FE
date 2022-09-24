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

const Chatbox = ({ account }) => {
  const launch = useLaunch();
  const isOpen = useIsOpen();
  const [friendsList, setFriendsList] = useState([]);
  const [taggedFriendsList, setTaggedFriendsList] = useState([]);

  const UserWallet = account;

  const wallets = async () => {
    const url = `https://ethglobalhack.kraznikunderverse.com/getCreated/${UserWallet}`;
    const { data } = await axios.get(url, {
      headers: { validate: process.env.REACT_APP_VALIDATE_TOKEN },
    });
    // setFriendsList(data?.data?.addresses);
    setFriendsList(data?.data?.addresses);
    console.log("friends list: ", data?.data?.addresses);
  };

  const getTaggedFriends = async () => {
    const url = `https://ethglobalhack.kraznikunderverse.com/getFriends/${UserWallet}`;
    const { data } = await axios.get(url, {
      headers: { validate: process.env.REACT_APP_VALIDATE_TOKEN },
    });
    console.log("tagged: ", data);
    // setFriendsList(data?.data?.addresses);
    setTaggedFriendsList(data?.data?.friends);
    // console.log("tagged friends list: ", data?.data?.addresses);
  };

  useEffect(() => {
    if (account) {
      wallets();
      getTaggedFriends();
    }
  }, [account]);

  return (
    <>
      <Container>
        <div>Friends List</div>
        {friendsList ? null : <div>Go on and mint with some :D</div>}
        {friendsList?.map((address) => {
          return (
            <>
              <h1>{address}</h1>
              <EPNS
                className="launch-receiver hover-scale"
                onClick={() => sendNotification(account, address)}
              >
                Invite
              </EPNS>
              <EPNS
                className="launch-receiver hover-scale"
                onClick={() => launch(address)}
              >
                Chat
              </EPNS>
            </>
          );
        })}
      </Container>
      <br />
      <br />
      <Container>
        <div>Tagged Friends List</div>
        {taggedFriendsList ? null : <div>No Tags yet</div>}
        {taggedFriendsList?.map((address) => {
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
                onClick={() => launch(address)}
              >
                Chat
              </EPNS>
            </>
          );
        })}
      </Container>
    </>
  );
};

export default Chatbox;
