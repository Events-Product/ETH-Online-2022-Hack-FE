import React from "react";
import styled from "styled-components";
import { Launcher, Window, useLaunch, useIsOpen } from "@relaycc/receiver";
import { sendNotification } from "./InviteNotification";
import { sendTaggedNotification } from "./TaggedNotification";

const Container = styled.div`
  display: inline-block;
  width: 400px;
  background: red;
`;
const EPNS = styled.button`
  display: flex;
`;

const Chatbox = () => {
  const launch = useLaunch();
  const isOpen = useIsOpen();
  return (
    <Container>
      <h1>Kraznik.eth</h1>
      <EPNS className="launch-receiver hover-scale" onClick={sendTaggedNotification}>
        Invite
      </EPNS>
      {/* <EPNS
        className="launch-receiver hover-scale"
        onClick={() => launch("0x0cb27e883E207905AD2A94F9B6eF0C7A99223C37")}
      >
        Chat
      </EPNS> */}
    </Container>
  );
};

export default Chatbox;
