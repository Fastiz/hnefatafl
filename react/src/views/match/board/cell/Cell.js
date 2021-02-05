import {
    NormalDiv,
    HoverCannotDiv,
    HoverCanDiv,
    MoveCircle,
    ThroneDiv,
    LastMoveDiv,
    RestrictedCellDiv
} from "./cellThemes";
import useDropZoneHook from "./useDropZoneHook";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useMemo} from "react";
import {positionEquals} from "../../../../backend/utils/utils";
import _ from 'lodash';
import {canMove, isRestrictedSquare} from "../../../../backend/utils/movement";
import {sendPieceMove} from "../../../../actions/matchMaking";
import {unselectPiece} from "../../../../actions/board";

const mapState = state => ({
    dimension: state.game.dimension,
    lastMove: state.game.moveList[state.game.moveList.length - 1],
    board: state.game.board,
    selectedPiece: state.board.selectedPiece
});

function Cell({position, children}){
    const {dimension, lastMove, board, selectedPiece} = useSelector(mapState);
    const dispatch = useDispatch();

    const canMovePiece = useMemo(()=>{
        if (_.isNil(selectedPiece)) return false;

        return canMove({
            from: selectedPiece.position,
            to: position,
            team: selectedPiece.team,
            isKing: selectedPiece.isKing,
            board
        })
    }, [selectedPiece, board, position]);

    const moveCallback = useCallback(() => {
        if(_.isNil(selectedPiece)) return;

        dispatch(unselectPiece());

        if(canMovePiece)
            dispatch(sendPieceMove(selectedPiece.position, position))
    }, [selectedPiece, canMove]);

    const {
         isOver,
         dropRef,
    } = useDropZoneHook({position, canMove: canMovePiece, onDrop: moveCallback});

    const isInLastMovePosition = useMemo(()=>{
        if(_.isNil(lastMove)) return false;

        return positionEquals(lastMove.to, position) || positionEquals(lastMove.from, position);
    }, [lastMove, position]);

    const isThrone = useMemo(()=>{
        const center = (dimension - 1) / 2;

        return position && position.x === center && position.y === center;
    }, [dimension, position]);

    const DecoratorDiv = useMemo(()=>{
        if (isOver) return canMovePiece ? HoverCanDiv : HoverCannotDiv;

        return isInLastMovePosition ?
            LastMoveDiv
            :
            isRestrictedSquare(position, board) ? RestrictedCellDiv : NormalDiv;

    }, [isOver, canMovePiece, isInLastMovePosition, board, selectedPiece]);

    return <DecoratorDiv ref={dropRef} onClick={moveCallback}>
        {canMovePiece && <MoveCircle/>}
        {isThrone && <ThroneDiv>{/*&times;*/}</ThroneDiv>}
        {children}
    </DecoratorDiv>;
}

export default Cell;