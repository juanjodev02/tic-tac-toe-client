import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import * as confetti from 'canvas-confetti';
import { Game } from 'src/app/core/models/Game';
import { User } from 'src/app/core/models/User';
import { AuthService } from 'src/app/core/services/auth.service';
import { GamesSocket } from 'src/app/sockets/GamesSocket';
import { UsersSocket } from 'src/app/sockets/UsersSocket';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  player = 1;
  lineColor = '#323259';
  canvas: any;
  context: any;
  canvasSize = 500;
  sectionSize: any;
  board: any;
  gameIsOver: boolean = false;
  winner: string = '';
  @Input()
  game: Game | null = null;

  currentUser: User | null = null;

  foreranUser: User | null = null;

  playersShapes: Map<string, string> = new Map([]);

  enableMovement: boolean = false;

  currentWinner: User | null = null;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private gamesSocket: GamesSocket,
    private usersSocket: UsersSocket,
    private authService: AuthService,
    private toastService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.playersShapes.set('O', this.game?.players[0].id as string);
      this.playersShapes.set('X', this.game?.players[1].id as string);
      if (this.game?.players[0].id == user?.id) {
        this.enableMovement = true;
      } else {
        this.enableMovement = false;
      }
      this.foreranUser = this.game?.players.find(
        (player) => player.id !== user?.id
      ) as User;
      this.canvas = document.getElementById('tic-tac-toe-board') as any;
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this.canvasSize;
      this.canvas.height = this.canvasSize;
      this.context.translate(0.5, 0.5);
      this.board = this.getInitialBoard('');
      this.sectionSize = this.canvasSize / 3;
      this.drawLines(10, this.lineColor);

      const listener = this.listenerCanvas.bind(this);

      this.canvas.addEventListener('mouseup', listener);

      this.usersSocket.on(
        'drawX',
        ({
          xCoordinate,
          yCoordinate,
        }: {
          xCoordinate: number;
          yCoordinate: number;
        }) => {
          this.player = 1;
          this.enableMovement = true;
          this.drawLines(10, this.lineColor);
          this.drawX(xCoordinate, yCoordinate, false);
          this.checkIfWinner();
          if (this.checkIfGameIsOver()) {
            this.gameIsOver = true;
            return;
          }
        }
      );

      this.usersSocket.on(
        'drawO',
        ({
          xCoordinate,
          yCoordinate,
        }: {
          xCoordinate: number;
          yCoordinate: number;
        }) => {
          this.player = 2;
          this.enableMovement = true;
          this.drawLines(10, this.lineColor);
          this.drawO(xCoordinate, yCoordinate, false);
          this.checkIfWinner();
          if (this.checkIfGameIsOver()) {
            this.gameIsOver = true;
            return;
          }
        }
      );
    });
  }

  listenerCanvas(event: any) {
    if (this.enableMovement) {
      if (this.player === 1) {
        this.player = 2;
      } else {
        this.player = 1;
      }
      var canvasMousePosition = this.getCanvasMousePosition(event);
      this.addPlayingPiece(canvasMousePosition);
      this.drawLines(10, this.lineColor);
    }
  }

  getInitialBoard(defaultValue: any) {
    var board = [];

    for (var x = 0; x < 3; x++) {
      board.push([]);

      for (var y = 0; y < 3; y++) {
        board[x].push(defaultValue as never);
      }
    }

    return board;
  }

  addPlayingPiece(mouse: any) {
    if (this.gameIsOver) {
      return;
    }
    var xCoordinate;
    var yCoordinate;

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        xCoordinate = x * this.sectionSize;
        yCoordinate = y * this.sectionSize;

        if (this.checkIfGameIsOver()) {
          this.gameIsOver = true;
          return;
        }

        if (
          mouse.x >= xCoordinate &&
          mouse.x <= xCoordinate + this.sectionSize &&
          mouse.y >= yCoordinate &&
          mouse.y <= yCoordinate + this.sectionSize &&
          this.checkIfPositionIsEmpty(x, y)
        ) {
          this.clearPlayingArea(xCoordinate, yCoordinate);
          if (this.player === 1) {
            this.drawX(xCoordinate, yCoordinate);
            this.enableMovement = false;
            this.checkIfWinner();
          } else {
            this.drawO(xCoordinate, yCoordinate);
            this.enableMovement = false;
            this.checkIfWinner();
          }
        }
      }
    }
  }

  clearPlayingArea(xCoordinate: any, yCoordinate: any) {
    this.context.fillStyle = '#252547';
    this.context.fillRect(
      xCoordinate,
      yCoordinate,
      this.sectionSize,
      this.sectionSize
    );
  }

  drawO(xCoordinate: any, yCoordinate: any, notify: boolean = true) {
    console.log(this.playersShapes);
    console.log(this.currentUser?.id);
    const userId = this.playersShapes.get('X');
    if (notify && userId !== this.currentUser?.id) {
      this.gamesSocket.emit('drawO', {
        userId,
        xCoordinate,
        yCoordinate,
      });
    }

    var halfSectionSize = 0.5 * this.sectionSize;
    var centerX = xCoordinate + halfSectionSize;
    var centerY = yCoordinate + halfSectionSize;
    var radius = (this.sectionSize - 100) / 2;
    var startAngle = 0 * Math.PI;
    var endAngle = 2 * Math.PI;

    this.context.lineWidth = 10;
    this.context.strokeStyle = '#01bBC2';
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, startAngle, endAngle);
    this.context.stroke();
    // update board
    this.board[yCoordinate / this.sectionSize][xCoordinate / this.sectionSize] =
      'O';
  }

  drawX(xCoordinate: any, yCoordinate: any, notify: boolean = true) {
    const userId = this.playersShapes.get('O');
    if (notify && userId !== this.currentUser?.id) {
      this.gamesSocket.emit('drawX', {
        userId,
        xCoordinate,
        yCoordinate,
      });
    }

    this.context.strokeStyle = '#f1be32';

    this.context.beginPath();

    var offset = 50;
    this.context.moveTo(xCoordinate + offset, yCoordinate + offset);
    this.context.lineTo(
      xCoordinate + this.sectionSize - offset,
      yCoordinate + this.sectionSize - offset
    );

    this.context.moveTo(
      xCoordinate + offset,
      yCoordinate + this.sectionSize - offset
    );
    this.context.lineTo(
      xCoordinate + this.sectionSize - offset,
      yCoordinate + offset
    );

    this.context.stroke();

    // update board
    this.board[yCoordinate / this.sectionSize][xCoordinate / this.sectionSize] =
      'X';
  }

  drawLines(lineWidth: any, strokeStyle: any) {
    var lineStart = 4;
    var lineLength = this.canvasSize - 5;
    this.context.lineWidth = lineWidth;
    this.context.lineCap = 'round';
    this.context.strokeStyle = strokeStyle;
    this.context.beginPath();

    /*
     * Horizontal lines
     */
    for (var y = 1; y <= 2; y++) {
      this.context.moveTo(lineStart, y * this.sectionSize);
      this.context.lineTo(lineLength, y * this.sectionSize);
    }

    /*
     * Vertical lines
     */
    for (var x = 1; x <= 2; x++) {
      this.context.moveTo(x * this.sectionSize, lineStart);
      this.context.lineTo(x * this.sectionSize, lineLength);
    }

    this.context.stroke();
  }

  getCanvasMousePosition(event: any) {
    var rect = this.canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  checkIfPositionIsEmpty(x: any, y: any) {
    return this.board[y][x] == '';
  }

  showWinner(winner: string) {
    const winnerId = this.playersShapes.get(winner);
    if (winner === '') {
      return;
    }
    this.gameIsOver = true;
    this.winner = winner;
    this.currentWinner = this.game?.players.find(
      (player) => player.id === winnerId
    ) as User;
    this.onWin();
  }

  checkIfWinner() {
    let winner = false;
    let winnerSymbol = '';

    // check rows
    for (var y = 0; y < 3; y++) {
      if (
        this.board[y][0] === this.board[y][1] &&
        this.board[y][1] === this.board[y][2] &&
        this.board[y][0] !== ''
      ) {
        winner = true;
        winnerSymbol = this.board[y][0];
      }
    }

    // check columns
    for (var x = 0; x < 3; x++) {
      if (
        this.board[0][x] === this.board[1][x] &&
        this.board[1][x] === this.board[2][x] &&
        this.board[0][x] !== ''
      ) {
        winner = true;
        winnerSymbol = this.board[0][x];
      }
    }

    // check diagonals
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      winner = true;
      winnerSymbol = this.board[0][0];
    }

    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      winner = true;
      winnerSymbol = this.board[0][2];
    }

    if (winner) {
      this.showWinner(winnerSymbol);
    }

    return winner;
  }

  checkIfGameIsOver() {
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        if (this.board[y][x] === '') {
          return false;
        }
      }
    }
    return true;
  }

  onWin() {
    const winnerId = this.playersShapes.get(this.winner);
    if (winnerId === this.currentUser?.id) {
      const canvas = this.renderer2.createElement('canvas');
      this.renderer2.setAttribute(canvas, 'id', 'confetti');
      this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

      const myConfetti = confetti.create(canvas, {
        resize: true,
      });

      myConfetti();
    } else {
      this.toastService.show('You lost!', 'You lost!', {
        status: 'danger',
      });
    }
  }

  resetGame() {
    this.gameIsOver = false;
    this.winner = '';
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }

  getByValue(map: Map<string, string>, searchValue: string): string {
    for (const [key, value] of map.entries()) {
      if (value === searchValue) return key;
    }
    return '';
  }
}
