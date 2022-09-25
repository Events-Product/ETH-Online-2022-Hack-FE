import React from 'react';
import styled from "styled-components";
import Header from "../assests/Header.png";

const Container = styled.div`
  background: linear-gradient(86.65deg, #efefef 48.22%, #f5e1f1 106.12%);
  align-items: center;
  justify-content: center;
  padding: 0 0 1000px 0;
`;

const Button = styled.button`
background: black;
border-radius:20px;
height:48px;
margin: 25px auto;
display:flex;
color:white;
font-size:24px;
text-align:center;
padding: 10px 20px;
text-decoration:none;

`

const Hack = () => {
  return (
    <>
    <Container>
        <img src={Header} width="100%"/>

        <a href="/moments"><Button>Moments</Button></a>
        <a href="/dynamic"><Button>Chat</Button></a>
        <a href="https://eth-online-tickets.web.app/video"><Button>NFTickets</Button></a>


        
    </Container>
    
    </>
  )
}

export default Hack