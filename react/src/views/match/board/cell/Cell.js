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
import {useSelector} from "react-redux";
import {useMemo} from "react";
import {positionEquals} from "../../../../reducers/game/backend/utils/utils";
import _ from 'lodash';
import {isRestrictedSquare} from "../../../../reducers/game/backend/utils/movement";

const mapState = state => ({
    dimension: state.game.dimension,
    lastMove: state.game.moveList[state.game.moveList.length - 1],
    board: state.game.board
});

function Cell({position, children, setIsOverPos, isOverPos}){
    const {dimension, lastMove, board} = useSelector(mapState);

    const {
         isOver,
         canDrop,
         dropRef,
    } = useDropZoneHook({position, setIsOverPos, isOverPos});

    const isInLastMovePosition = useMemo(()=>{
        if(_.isNil(lastMove)) return false;

        return positionEquals(lastMove.to, position) || positionEquals(lastMove.from, position);
    }, [lastMove, position]);

    const DecoratorDiv = useMemo(()=>{
       return isOver ?
           canDrop ? HoverCanDiv : HoverCannotDiv
           :
           isInLastMovePosition ?
               LastMoveDiv
               :
               isRestrictedSquare(position, board) ? RestrictedCellDiv : NormalDiv;

    }, [isOver, canDrop, isInLastMovePosition, board]);

    const isThrone = useMemo(()=>{
        const center = (dimension - 1) / 2;

        return position && position.x === center && position.y === center;
    }, [dimension, position]);

    return <DecoratorDiv ref={dropRef}>
        {canDrop && <MoveCircle/>}
        {isThrone && <ThroneDiv>&times;</ThroneDiv>}
        {children}
    </DecoratorDiv>;
}

export default Cell;