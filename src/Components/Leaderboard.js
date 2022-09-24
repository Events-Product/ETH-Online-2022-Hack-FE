import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { config } from "../config/config";

const Container = styled.div`
  display: grid;
  justify-content: center;
`;
const LeadCont = styled.div`
  display: inline-block;
  justify-items: space-around;
  width: 80vw;
`;

const Text = styled.h1`
  display: inline-block;
  margin: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const Text1 = styled.div`
  display: inline-block;
  margin: 10px;
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
        <Text1>{item.address}</Text1>
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
