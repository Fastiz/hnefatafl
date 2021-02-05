import React from 'react';
import {Button, Spin} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {findMatch} from "../actions/matchMaking";
import styled from 'styled-components'
import ConnectionStatus from "../components/ConnectionStatus";
import _ from 'lodash';

const SDiv = styled.div`
    max-width: 20rem;
    text-align: center;
    margin: 0 auto 0 auto;
`;

const SButton = styled(Button)`
    width: 100%;
`;

const SH1 = styled.h1`
    margin-bottom: 3rem;
`;

const mapState = state => _.pick(state, ['home', 'connection']);

function Home({className}){
    const {home, connection} = useSelector(mapState);
    const dispatch = useDispatch();

    const {lookingForMatch} = home;
    const {numberOfPlayers, numberOfMatches} = connection;

    return <div className={className}>
        <ConnectionStatus/>
        <SDiv>
            <SH1>Hnefatafl</SH1>

            <p>Number of matches: {_.isNil(numberOfMatches) ? <Spin/> : numberOfMatches}</p>
            <p>Number of players: {_.isNil(numberOfPlayers) ? <Spin/> : numberOfPlayers}</p>

            <SButton
                onClick={()=>dispatch(findMatch())}
                loading={lookingForMatch}
            >
                Find any match
            </SButton>
        </SDiv>
    </div>
}

export default styled(Home)`
    padding-top: 10rem;
    width: 100vw;
    height: 100vh;
    background: #e4e4e4;
`;