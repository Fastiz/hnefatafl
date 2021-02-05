import {useDispatch, useSelector} from "react-redux";
import {useDrop} from "react-dnd";
import {canMove} from "../../../../backend/utils/movement";
import {sendPieceMove} from "../../../../actions/matchMaking";

const mapState = state => state.game;

function useDropZoneHook({position, canMove, onDrop}){
    const dispatch = useDispatch();

    const [{isOver, canDrop}, dropRef] = useDrop({
        accept: 'piece',
        canDrop: (item, monitor) => canMove,
        drop: () => onDrop(),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        })
    });

    return {
        isOver,
        canDrop,
        dropRef,
    };
}

export default useDropZoneHook;