import {Broker} from "../broker";
import {merge} from "rxjs";
import {matchFound, MESSAGES, Team} from "./constants";
import {Piece, Position} from "./piece";
import {filter, takeWhile} from "rxjs/operators";
import {pieceMoveFromSocketMessage} from "./operators/pieceMoveFromSocketMessage";
import {ofEvent} from "./operators/ofEvent";
import {changeTurn, checkGameState, isMoveValid, movePiece} from "./backend";
import {initialPieces} from "./initialPieces";
import {chatMessageToSocketMessage, pieceMoveToSocketMessage} from "./utils";
import {chatMessageFromSocketMessage} from "./operators/chatMessageFromSocketMessage";

export enum GameStatus {
    Playing             = "PLAYING",
    KingCaptured        = "KING_CAPTURED",
    KingEscaped         = "KING_ESCAPED",
    DefendersSurrounded = "DEFENDERS_SURROUNDED",
    Draw                = "DRAW"
}

export interface PieceMove {
    team: Team,
    from: Position,
    to: Position
}

export interface ChatMessage {
    from: Team,
    message: string
}

export interface GameInstance {

}

class GameInstanceImpl implements GameInstance {
    private broker: Broker;
    private board: Piece[][];
    private teamTurn: Team;
    private gameStatus: GameStatus;

    constructor(broker: Broker) {
        this.broker = broker;
        this.teamTurn = Team.WHITE;
        this.board = initialPieces(null);
        this.gameStatus = GameStatus.Playing;

        this.broker.sendMessage1(matchFound({playerTeam: Team.BLACK}));
        this.broker.sendMessage2(matchFound({playerTeam: Team.WHITE}));

        this.configurePieceMoves(Team.BLACK, Team.WHITE);
        this.configureChat(Team.BLACK, Team.WHITE);
    }

    private configurePieceMoves(team1: Team, team2: Team): void {
        merge(
            this.broker.getSubject1()
                .pipe(
                    ofEvent(MESSAGES.PIECE_MOVED),
                    pieceMoveFromSocketMessage(team1)
                ),
            this.broker.getSubject2()
                .pipe(
                    ofEvent(MESSAGES.PIECE_MOVED),
                    pieceMoveFromSocketMessage(team2)
                )
        ).pipe(
            takeWhile(() => {
                return this.gameStatus === GameStatus.Playing;
            }),
            //Checks if was team turn
            filter((move: PieceMove) => {
                const {team} = move;

                return team === this.teamTurn;
            }),
            //Checks if piece was from team
            filter((move: PieceMove) => {
                const {team, from} = move;

                return this.board[from.x][from.y]
                    && team === this.board[from.x][from.y].getTeam();
            }),
            //Checks if move is valid
            filter((move: PieceMove) => {
                return isMoveValid(move, this.board);
            }),
        ).subscribe(
            {
                next: (validMove: PieceMove) => {
                    this.teamTurn = changeTurn(this.teamTurn);

                    this.board = movePiece(validMove, this.board);

                    this.broker.broadcast(
                        pieceMoveToSocketMessage(validMove)
                    );

                    this.gameStatus = checkGameState(validMove, this.board);
                },
                error: ()=>{},
                complete: ()=>{
                    console.log('GAME ENDED', this.gameStatus);
                }
            }
        );
    }

    private configureChat(team1: Team, team2: Team): void {
        merge(
            this.broker.getSubject1()
                .pipe(
                    ofEvent(MESSAGES.CHAT_MESSAGE),
                    chatMessageFromSocketMessage(team1)
                ),
            this.broker.getSubject2()
                .pipe(
                    ofEvent(MESSAGES.CHAT_MESSAGE),
                    chatMessageFromSocketMessage(team2)
                )
        ).subscribe((chatMessage: ChatMessage) => {
            this.broker.broadcast(
                chatMessageToSocketMessage(chatMessage)
            )
        })
    }
}

export default GameInstanceImpl;