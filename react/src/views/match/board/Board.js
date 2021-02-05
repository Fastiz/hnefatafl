import styled from "styled-components";
import _ from 'lodash';
import {DndProvider, useDrop} from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {useSelector} from "react-redux";
import BlackPiece from "./piece/BlackPiece";
import WhitePiece from "./piece/WhitePiece";
import {TEAM} from "../../../backend/constants";
import Cell from "./cell/Cell";
import KingPiece from "./piece/KingPiece";

const SIDE = 11;

const mapState = state => state.game;

function Board({className}){
    const {
        board,
        dimension,
    } = useSelector(mapState);

    return <DndProvider backend={HTML5Backend}>
        <div className={className}>
        {
            _.times(dimension).map(x =>
                _.times(dimension).map(y => {
                    const piece = board[x][y];

                    let child = null;
                    if(!_.isNil(piece)){
                        if(piece.isKing()){
                            child = <KingPiece position={{x, y}}/>;
                        }else{
                            child = piece.getTeam() === TEAM.BLACK ?
                                <BlackPiece
                                    position={{x, y}}
                                />
                                :
                                <WhitePiece
                                    position={{x, y}}
                                />;
                        }
                    }

                    return <Cell
                        key={'cell_(' + x + ',' + y + ')'}
                        position={{x, y}}
                    >
                        {child}
                    </Cell>;
                })
            )
        }
        </div>
    </DndProvider>
}

export default styled(Board)`
        background: #de9c47;
        display: grid;
        grid-template-columns: repeat(${SIDE}, 1fr);
        grid-template-rows: repeat(${SIDE}, 1fr);
        grid-row-gap: 2px;
        grid-column-gap: 2px;
        width: min(60vh, 80vw);
        height: min(60vh, 80vw);
        padding: 3px;
    `;