import styled from "styled-components";
import Piece from "./Piece";
import {TEAM} from "../../../../backend/constants";

function BlackPeace({className, ...props}){

    return <Piece className={className} {...props} team={TEAM.BLACK}/>;
}

export default styled(BlackPeace)`
    background: black;
`;