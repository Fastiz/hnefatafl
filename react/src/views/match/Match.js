import Board from "./board/Board";
import styled from "styled-components";
import {TEAM} from "../../backend/constants";
import {useSelector} from "react-redux";
import _ from 'lodash';
import Chat from "./board/chat/Chat";
import ConnectionStatus from "../../components/ConnectionStatus";

const WhiteText = styled.span`
    color: white;
    font-size: 1.5rem;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
`;

const BlackText = styled.span`
    color: black;
    font-size: 1.5rem;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
`;

const InfoDiv = styled.div`
    padding-top: 4rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    grid-area: info;
`;

const BoardDiv = styled.div`
    grid-area: board;
    
    display: flex;
    justify-content: center;
    // align-items: center;
`;

const ChatDiv = styled.div`
    grid-area: chat;
    max-width: 25rem;
    background: #e0e0e0;
    border: #adadad 1px solid;
    height: 30rem;
`;

const Background = styled.div`
    background: #e4e4e4;
    height: 100vh;
    display: grid;
    grid-template-areas: ".     info    ."
                        ".      board   .";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 5fr;
`;

function teamToComponent(team){
    return team === TEAM.WHITE ? <WhiteText>white</WhiteText> : <BlackText>black</BlackText>;
}

const mapState = state => state.game;

function Match({className}){
    const {
        playerTeam,
        teamTurn,
        winner
    } = useSelector(mapState);

    return <Background className={className}>
        <ConnectionStatus/>
        <InfoDiv>
            <h2>You are team {teamToComponent(playerTeam)}</h2>
            {
                _.isNil(winner) ?
                    <h2>It is {teamToComponent(teamTurn)} turn</h2>
                    :
                    winner === TEAM.BLACK ?
                        <h2>King escaped! {teamToComponent(winner)} wins!</h2>
                        :
                        <h2>King was captured! {teamToComponent(winner)} wins!</h2>
            }
        </InfoDiv>

        <BoardDiv>
            <Board/>
        </BoardDiv>

        {/*<ChatDiv>*/}
        {/*    <Chat/>*/}
        {/*</ChatDiv>*/}
    </Background>
}

export default Match;