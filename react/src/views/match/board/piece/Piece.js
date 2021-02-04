import styled from "styled-components";
import {useDrag} from 'react-dnd';
import {useSelector} from "react-redux";
import _ from 'lodash';

const mapState = state => state.game;

function usePieceDrag({position, isKing, team}){
    const {
        playerTeam,
        teamTurn,
        winner
    } = useSelector(mapState);

    return useDrag({
        item: {
            type: 'piece',
            position: position,
            isKing,
            team
        },
        canDrag: () => team === playerTeam && teamTurn === playerTeam && _.isNil(winner),
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            itemId: monitor.getItem() && monitor.getItem().id
        })
    });
}

function Piece({className, position, isKing, team, children}){
    const [{isDragging, itemId}, dragRef] = usePieceDrag({position, isKing, team});

    if(isDragging && itemId === 'piece_' + position)
        return;

    return <div className={className} ref={dragRef}>{children}</div>;
}

export default styled(Piece)`
    width: 80%;
    height: 80%;
    border-radius: 50%;
    z-index: 1;
`;