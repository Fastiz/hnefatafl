import styled from "styled-components";
import {useDrag} from 'react-dnd';
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import {selectPiece, unselectPiece} from "../../../../actions/board";

const mapState = state => state.game;

function usePieceDrag({canDrag, position, isKing, team}){
    const dispatch = useDispatch();

    return useDrag({
        item: {
            type: 'piece',
        },
        canDrag: () => canDrag,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
        begin: () => dispatch(selectPiece({position, isKing, team})),
        end: () => dispatch(unselectPiece())
    });
}

function Piece({className, position, isKing, team, children}){
    const {
        playerTeam,
        teamTurn,
        winner
    } = useSelector(mapState);

    const dispatch = useDispatch();

    const canMove = team === playerTeam && teamTurn === playerTeam && _.isNil(winner);

    const [{isDragging}, dragRef] = usePieceDrag({canDrag: canMove, position, isKing, team});

    if(isDragging)
        return null;

    return <div
        className={className}
        ref={dragRef}
        onClick={() => canMove && dispatch(selectPiece({position, isKing, team}))}
    >
        {children}
    </div>;
}

export default styled(Piece)`
    width: 80%;
    height: 80%;
    border-radius: 50%;
    z-index: 1;
`;