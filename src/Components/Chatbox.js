import React from 'react';
import styled from "styled-components";

const Container = styled.div`
display:inline-block;
width:400px;
`

const Chatbox = () => {
    return (
        <div>
            <Container>
                <h3>Kraznik.eth</h3>
                <button>Invite</button>
                <button>Say Hi</button>
            </Container>
            
        </div>
    )
}

export default Chatbox
