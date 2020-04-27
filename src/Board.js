import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);
    // TODO: set initial state
    this.state = {
      board: this.createBoard(),
      hasWon: false
    }
    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [...Array(this.props.nrows)].map(x => [...Array(this.props.ncols)].map(x => Math.random() < this.props.chanceLightStartsOn ? 1 : 0));
    // TODO: create array-of-arrays of true/false values
    return board;
  }

  checkWin(board) {
    // win when every cell is turned off
    // TODO: determine is the game has been won
    let sum = board.reduce(
      (sum, row) => sum + row.reduce((a, b) => a + b, 0)
    , 0);

    return sum === 0;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = [...this.state.board];
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    this.setState({board: board, hasWon: this.checkWin(board)});
  }

  /** Render game board or winning message. */

  render() {
    if(this.state.hasWon){
      return (
        <div>
          <div className='Board-title'>
            <div className='winner'>
              <span className='neon-orange'>YOU</span>
              <span className='neon-blue'>WIN!</span>
            </div>
          </div>
        </div>
      );
    }

    // if the game is won, just show a winning msg & render nothing else
    let boardHTML = this.state.board.map((row, yCo) => <tr key={`r${yCo}`}>
      {row.map((cell, xCo) => <Cell 
        coord={`${yCo}-${xCo}`} key={`${yCo}-${xCo}`}
        isLit={cell} flipCellsAroundMe={this.flipCellsAround}
      />)}
    </tr>);

    return(
      <div>
        <div className='Board-title'>
          <div className='neon-orange'>Lights</div>
          <div className='neon-blue'>Out</div>
        </div>
        <table className='Board'>
          <tbody>
            {boardHTML}
          </tbody>
        </table>
      </div>
    );

  }
}


export default Board;
