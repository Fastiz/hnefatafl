import {merge, Observable, throwError} from "rxjs";
import {matchFound, MESSAGES, Team} from "./constants";
import {Piece, Position} from "./piece";
import {filter, map, startWith, switchMap, takeWhile, tap} from "rxjs/operators";
import {pieceMoveFromSocketMessage} from "./operators/pieceMoveFromSocketMessage";
import {ofEvent} from "./operators/ofEvent";
import {changeTurn, checkGameState, isMoveValid, movePiece} from "./backend";
import {initialPieces} from "./initialPieces";
import {chatMessageToSocketMessage, pieceMoveToSocketMessage} from "./utils";
import {chatMessageFromSocketMessage} from "./operators/chatMessageFromSocketMessage";
import Room from "../room";
import {SocketMessage} from "../connection/Connection";

function disconnection(){
    return function(source){
        return source.pipe(
            tap((message: SocketMessage) => {
                const {event} = message;

                if(event === MESSAGES.LEAVE_GAME)
                    throw new Error('player left game');
            })
        )
    }
}

function fromTeam(team: Team){
    return function(source){
        return source.pipe(
            ofEvent(MESSAGES.PIECE_MOVED),
            pieceMoveFromSocketMessage(team)
        )
    }
}

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

class GameInstance {
    private broker: Room;
    private board: Piece[][];
    private teamTurn: Team;
    private gameStatus: GameStatus;

    private readonly gameObservable: Observable<PieceMove>;

    constructor(broker: Room) {
        this.broker = broker;
        this.teamTurn = Team.WHITE;
        this.board = initialPieces(null);
        this.gameStatus = GameStatus.Playing;

        this.broker.getPlayer1().getSend$().next(matchFound({playerTeam: Team.BLACK}));
        this.broker.getPlayer2().getSend$().next(matchFound({playerTeam: Team.WHITE}));

        this.gameObservable = this.configurePieceMoves(Team.BLACK, Team.WHITE);

        this.gameObservable.subscribe({
            error: () => this.broker.broadcast({event: MESSAGES.OPPONENT_DISCONNECTED, data: null})
        })
    }

    public getGameObservable() : Observable<PieceMove> {
        return this.gameObservable;
    }

    private configurePieceMoves(team1: Team, team2: Team): Observable<PieceMove> {
        return merge(
            this.broker.getPlayer1().getReceive$()
                .pipe(
                    disconnection(),
                    fromTeam(team1),
                ),
            this.broker.getPlayer2().getReceive$()
                .pipe(
                    disconnection(),
                    fromTeam(team2)
                ),
        ).pipe(
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
            //Execute game logic
            tap((validMove: PieceMove) => {
                this.teamTurn = changeTurn(this.teamTurn);

                this.board = movePiece(validMove, this.board);

                this.broker.broadcast(
                    pieceMoveToSocketMessage(validMove)
                );

                this.gameStatus = checkGameState(validMove, this.board);
            }),
            takeWhile(() => {
                return this.gameStatus === GameStatus.Playing;
            }),
        );
    }

    private configureChat(team1: Team, team2: Team): void {
        merge(
            this.broker.getPlayer1().getReceive$()
                .pipe(
                    ofEvent(MESSAGES.CHAT_MESSAGE),
                    chatMessageFromSocketMessage(team1)
                ),
            this.broker.getPlayer2().getReceive$()
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

export default GameInstance;