import styled from "styled-components";
import Piece from "./Piece";
import {TEAM} from "../../../../reducers/game/backend/constants";

function WhitePeace({className, ...props}){

    return <Piece className={className} {...props} team={TEAM.WHITE}/>;
}

export default styled(WhitePeace)`
    background: white;
`;