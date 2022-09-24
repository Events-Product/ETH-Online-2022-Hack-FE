import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { config } from "../config/config";

const Container = styled.div`
  display: grid;
  justify-content: center;
  border:1px solid black;
  border-radius:20px
  width: 80vw;
  margin: 0 auto;
`;

const LeadCont = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: space-between;
  width: 80vw;
  border-bottom: 1px solid black;
`;

const Text = styled.h1`
  display: inline-block;
  justify-items: space-around;
  margin: 10px;
  font-size: 24px;
  &:hover {
    cursor: pointer;
  }
`;
const Text1 = styled.div`
  display: inline-block;
  margin: 10px;
  font-size: 24px;
  color: grey;
`;

const Leaderboard = () => {
  const [listOnCount, setListOnCount] = useState([]);

  const fetchDataOnCount = async () => {
    const url = `${config.apiBaseUrl}/leaderboardCount`;
    const { data } = await axios.get(url, config.authOptions);
    var listCards = [];
    data?.data?.map((item, index) => {
      const card = renderRow(index + 1, item);
      listCards.push(card);
    });
    setListOnCount(listCards);
  };

  const fetchOnCreation = async () => {
    const url = `${config.apiBaseUrl}/leaderboardCreation`;
    const { data } = await axios.get(url, config.authOptions);
    var listCards = [];
    data?.data?.map((item, index) => {
      const card = renderRow(index + 1, item);
      listCards.push(card);
    });
    setListOnCount(listCards);
  };

  const fetchOnTagged = async () => {
    const url = `${config.apiBaseUrl}/leaderboardTagged`;
    const { data } = await axios.get(url, config.authOptions);
    var listCards = [];
    data?.data?.map((item, index) => {
      const card = renderRow(index + 1, item);
      listCards.push(card);
    });
    setListOnCount(listCards);
  };

  const renderRow = (rank, item) => {
    return (
      <LeadCont>
        <Text1>{rank}</Text1>
        <Text1>{item.address.slice(0, 7)}</Text1>
        <Text1>{item.count}</Text1>
        <Text1>{item.creations}</Text1>
        <Text1>{item.tagged}</Text1>
      </LeadCont>
    );
  };

  useEffect(() => {
    fetchDataOnCount();
  }, []);

  return (
    <>
      <Container>
        <LeadCont>
          <Text>Rank</Text>
          <Text>Creator</Text>
          <Text onClick={fetchDataOnCount}>Moments </Text>
          <Text onClick={fetchOnCreation}>MomentsCaptured</Text>
          <Text onClick={fetchOnTagged}>MomentsTagged</Text>
        </LeadCont>
        {listOnCount}
      </Container>
    </>
  );
};

export default Leaderboard;
