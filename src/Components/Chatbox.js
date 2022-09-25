import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Launcher, Window, useLaunch, useIsOpen } from "@relaycc/receiver";
import { sendNotification } from "./InviteNotification";
import "./style.css";
import Header from "../assests/Header.png";
// import { sendTaggedNotification } from "../Components/TaggedNotification";
import axios from "axios";
const Container = styled.div`
  background: linear-gradient(86.65deg, #efefef 48.22%, #f5e1f1 106.12%);
  padding: 0 0 100px 0;

  @media (max-width: 800px) {
    padding: 0 0 1000px 0;
  }
`;

const Address = styled.div`
  display: inline-block;
  max-width: 100px;
  margin: 20px;
`;
const EPNS = styled.button`
  display: inline-block;
  align-items: center;
  background-color: black;
  height: 48px;
  color: white;
  margin: 20px;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  border-radius: 50px;
  width:100px;

  @media (max-width: 800px) {
  }
`;

const EPNS2 = styled.button`
  display: inline-block;
  margin: 20px;

  background-color: black;
  height: 48px;
  color: white;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  border-radius: 50px;
  width:100px;

  @media (max-width: 800px) {
  }
`;

const Section = styled.div`
  background: linear-gradient(86.65deg, #efefef 48.22%, #f5e1f1 106.12%);
  border: 1px solid black;
  border-radius: 20px;
  max-width: 700px;
  display: flex;
  margin: 20px auto;

  @media (max-width: 800px) {
    max-width: 400px;
    margin: 0;
  }
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
        <h1 className="title">Friends List</h1>
        {friendsList ? null : <div>Go on and mint with some :D</div>}
        {friendsList?.map((address) => {
          return (
            <>
              <Section>
                <Address>{address.slice(0, 7)}</Address>
                <EPNS onClick={() => sendNotification(account, address)}>
                  Invite
                </EPNS>
                <EPNS2 onClick={() => launch(address)}>Chat</EPNS2>
              </Section>
            </>
          );
        })}

        <br />
        <br />

        <h2 className="title">Tagged Friends List</h2>
        {taggedFriendsList ? null : <div>No Tags yet</div>}
        {taggedFriendsList?.map((address) => {
          return (
            <>
              <Section>
                <Address>{address.slice(0, 7)}</Address>
                <EPNS onClick={() => sendNotification(address)}>Invite</EPNS>
                <EPNS2 onClick={() => launch(address)}>Chat</EPNS2>
              </Section>
            </>
          );
        })}
      </Container>
    </>
  );
};

export default Chatbox;
