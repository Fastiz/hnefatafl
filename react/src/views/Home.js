import React from 'react';
import {Button} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {findMatch} from "../actions/matchMaking";
import styled from 'styled-components'

const mapState = state => ({
    lookingForMatch: state.home.lookingForMatch
});

const SDiv = styled.div`
    margin: 10rem auto 0 auto;
    max-width: 20rem;
    text-align: center;
`;

const SButton = styled(Button)`
    width: 20rem;
`;

function Home(){
    const {lookingForMatch} = useSelector(mapState);
    const dispatch = useDispatch();

    return <SDiv>
        <SButton
            onClick={()=>dispatch(findMatch())}
            loading={lookingForMatch}
        >
            Find match
        </SButton>
    </SDiv>
}

export default Home;