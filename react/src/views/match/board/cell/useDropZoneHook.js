import {useDispatch, useSelector} from "react-redux";
import {useDrop} from "react-dnd";
import {canMove} from "../../../../reducers/game/backend/utils/movement";
import {sendPieceMove} from "../../../../actions/matchMaking";

const mapState = state => state.game;

function useDropZoneHook({position}){
    const {board} = useSelector(mapState);

    const dispatch = useDispatch();

    const [{isOver, canDrop}, dropRef] = useDrop({
        accept: 'piece',
        canDrop: (item, monitor) => canMove({
            from: item.position,
            to: position,
            board,
            isKing: item.isKing,
            team: item.team,
        }),
        drop: (item, monitor) => dispatch(sendPieceMove(item.position, position)),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem()
        })
    });

    return {
        isOver,
        canDrop,
        dropRef,
    };
}

export default useDropZoneHook;