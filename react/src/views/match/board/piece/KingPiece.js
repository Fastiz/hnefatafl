import styled from "styled-components";
import Piece from "./Piece";
import {TEAM} from "../../../../reducers/game/backend/constants";

const CrossDiv = styled.div`
    color: white;
    font-size: 4rem;
    background: none;
    line-height: 0;
`;

function KingPiece({className, ...props}){

    return <Piece className={className} {...props} team={TEAM.BLACK} isKing={true}>
        <CrossDiv>+</CrossDiv>
    </Piece>;
}

export default styled(KingPiece)`
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
`;