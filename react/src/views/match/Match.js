import Board from "./board/Board";
import styled from "styled-components";
import {TEAM} from "../../backend/constants";
import {useDispatch, useSelector} from "react-redux";
import ConnectionStatus from "../../components/ConnectionStatus";
import {GAME_STATUS} from "../../reducers/game";
import {Button} from "antd";
import {Link} from "react-router-dom";
import {HOME} from "../../constants/routes";
import {leaveGame} from "../../actions/game";
import {Redirect} from "react-router";

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
                        ".      board   ."
                        ".      back    .";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 4fr 1fr;
`;

const BackDiv = styled.div`
    grid-area: back;
    
    display: flex;
    justify-content: center;
    width: 100%;
`;

function teamToComponent(team){
    return team === TEAM.WHITE ? <WhiteText>white</WhiteText> : <BlackText>black</BlackText>;
}

function GameStatus({gameStatus, teamTurn}){
    switch(gameStatus){
        case GAME_STATUS.PLAYING:
            return <>
                <h2>It is {teamToComponent(teamTurn)} turn</h2>
            </>;
        case GAME_STATUS.KING_CAPTURED:
            return <>
                <h2>King was captured! {teamToComponent(TEAM.WHITE)} wins!</h2>
            </>;
        case GAME_STATUS.KING_ESCAPED:
            return <>
                <h2>King escaped! {teamToComponent(TEAM.BLACK)} wins!</h2>
            </>;
        case GAME_STATUS.DEFENDERS_SURROUNDED:
            return <>
                <h2>Defenders surrounded! {teamToComponent(TEAM.WHITE)} wins!</h2>
            </>;
        case GAME_STATUS.LOST_CONNECTION:
            return <>
                <h2>Lost connection with the other player</h2>
            </>;
        default:
            return null;
    }
}

const mapState = state => state.game;

function Match({className}){
    const {
        playerTeam,
        teamTurn,
        gameStatus
    } = useSelector(mapState);
    const dispatch = useDispatch();

    if(_.isNil(gameStatus)) return <Redirect to={HOME}/>;

    return <Background className={className}>
        <ConnectionStatus/>
        <InfoDiv>
            <h2>You are team {teamToComponent(playerTeam)}</h2>

            <GameStatus gameStatus={gameStatus} teamTurn={teamTurn}/>
        </InfoDiv>

        <BoardDiv>
            <Board/>
        </BoardDiv>

        <BackDiv>
            <Button onClick={() => dispatch(leaveGame())}>Leave game</Button>
        </BackDiv>

    </Background>
}

export default Match;