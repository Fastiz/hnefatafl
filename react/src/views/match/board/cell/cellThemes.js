import styled from "styled-components";

const CELL_BACKGROUND = '#ffbe6a';
const GREEN = 'green';
const RED = 'red';
const LAST_MOVE_COLOR = '#caa674';
const RESTRICTED_CELL_BACKGROUND = '#e0a04d';

const BaseDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const NormalDiv = styled(BaseDiv)`
    background: ${CELL_BACKGROUND};
`;

export const RestrictedCellDiv = styled(BaseDiv)`
    background: ${RESTRICTED_CELL_BACKGROUND};
`;

export const LastMoveDiv = styled(BaseDiv)`
    background: ${LAST_MOVE_COLOR};
`;

export const ThroneDiv = styled(NormalDiv)`
    color: black;
    font-size: 4rem;
    position: absolute;
    background: none;
`;

export const MoveCircle = styled.div`
    background: ${GREEN};
    border-radius: 50%;
    width: 8px;
    height: 8px;
    position: absolute;
`;

export const HoverCanDiv = styled(BaseDiv)`
    background: ${GREEN};
    opacity: 0.5;
`;

export const HoverCannotDiv = styled(BaseDiv)`
    background: ${RED};
    opacity: 0.5;
`;